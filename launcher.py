#!/usr/bin/env python3
"""Offline GTK desktop host. Compatible with Python 3.6 / Ubuntu 18.04."""
import json
import os
from pathlib import Path
import sys
import tempfile


def data_directory():
    base = os.environ.get('XDG_DATA_HOME')
    if not base or not os.path.isabs(base):
        base = str(Path.home() / '.local' / 'share')
    return Path(base) / 'bop-and-bloom'


def valid_state(value):
    return (isinstance(value, dict) and value.get('version') == 1
            and isinstance(value.get('profiles'), list)
            and len(value['profiles']) <= 24
            and isinstance(value.get('settings'), dict))


def load_state(directory):
    path = directory / 'profiles.json'
    if not path.exists():
        return None, None
    try:
        if path.stat().st_size > 262144:
            raise ValueError('Profile file is too large')
        value = json.loads(path.read_text(encoding='utf-8'))
        if not valid_state(value):
            raise ValueError('Unsupported profile format')
        return value, None
    except (OSError, ValueError) as exc:
        # Keep a damaged file for recovery instead of silently overwriting it.
        try:
            backup = directory / 'profiles.recovery.json'
            if not backup.exists():
                backup.write_bytes(path.read_bytes())
                backup.chmod(0o600)
        except OSError:
            pass
        return None, str(exc)


def save_state(directory, raw):
    if not isinstance(raw, str) or len(raw.encode('utf-8')) > 262144:
        raise ValueError('Profile data exceeds limit')
    value = json.loads(raw)
    if not valid_state(value):
        raise ValueError('Invalid profile data')
    directory.mkdir(mode=0o700, parents=True, exist_ok=True)
    fd, temporary = tempfile.mkstemp(prefix='.profiles-', dir=str(directory))
    try:
        with os.fdopen(fd, 'w', encoding='utf-8') as stream:
            json.dump(value, stream, ensure_ascii=False, separators=(',', ':'))
            stream.flush()
            os.fsync(stream.fileno())
        os.replace(temporary, str(directory / 'profiles.json'))
    finally:
        if os.path.exists(temporary):
            os.unlink(temporary)


def main():
    import gi
    gi.require_version('Gtk', '3.0')
    try:
        gi.require_version('WebKit2', '4.1')
    except ValueError:
        gi.require_version('WebKit2', '4.0')
    from gi.repository import Gtk, WebKit2, Gdk

    directory = data_directory()
    state, error = load_state(directory)
    app_dir = Path(__file__).resolve().parent / 'app'
    index_uri = (app_dir / 'index.html').as_uri()
    manager = WebKit2.UserContentManager()
    payload = json.dumps(state, ensure_ascii=True).replace('<', '\\u003c')
    script = WebKit2.UserScript.new(
        'window.__BOP_DATA__ = ' + payload + ';',
        WebKit2.UserContentInjectedFrames.TOP_FRAME,
        WebKit2.UserScriptInjectionTime.START, None, None)
    manager.add_script(script)
    manager.register_script_message_handler('save')
    # Ephemeral browser storage: all lasting data uses the atomic native save path.
    context = WebKit2.WebContext.new_ephemeral()
    view = WebKit2.WebView(web_context=context, user_content_manager=manager)
    settings = view.get_settings()
    settings.set_enable_developer_extras(False)
    settings.set_enable_html5_local_storage(False)
    settings.set_enable_page_cache(False)
    window = Gtk.Window(title='Bop & Bloom')
    window.set_default_size(1120, 850)
    window.set_size_request(620, 600)
    window.set_position(Gtk.WindowPosition.CENTER)
    window.set_icon_from_file(str(app_dir / 'icon.svg'))
    window.add(view)
    window.connect('destroy', Gtk.main_quit)

    def receive_save(_manager, result):
        try:
            # Requires WebKitGTK 2.22+, available in Ubuntu 18.04 updates.
            raw = result.get_js_value().to_string()
            save_state(directory, raw)
        except Exception as exc:
            print('Could not save profile: {}'.format(exc), file=sys.stderr)
            view.run_javascript('window.bopSaveError && window.bopSaveError();', None, None, None)

    def decide_policy(_view, decision, decision_type):
        if decision_type in (WebKit2.PolicyDecisionType.NAVIGATION_ACTION,
                             WebKit2.PolicyDecisionType.NEW_WINDOW_ACTION):
            uri = decision.get_navigation_action().get_request().get_uri()
            if uri != index_uri:
                decision.ignore()
                return True
        return False

    fullscreen = [False]
    def key_press(_window, event):
        if event.keyval == Gdk.KEY_F11:
            fullscreen[0] = not fullscreen[0]
            window.fullscreen() if fullscreen[0] else window.unfullscreen()
            return True
        return False

    manager.connect('script-message-received::save', receive_save)
    view.connect('decide-policy', decide_policy)
    window.connect('key-press-event', key_press)
    view.load_uri(index_uri)
    window.show_all()
    if error:
        alert = Gtk.MessageDialog(transient_for=window, modal=True,
                                  message_type=Gtk.MessageType.WARNING,
                                  buttons=Gtk.ButtonsType.OK,
                                  text='Your saved playroom could not be opened.')
        alert.format_secondary_text('You can create a new player. The old profile file was kept for recovery in {}.'.format(directory))
        alert.run()
        alert.destroy()
    Gtk.main()


if __name__ == '__main__':
    main()
