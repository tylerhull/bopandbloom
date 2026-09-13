"""Run: python3 -m unittest discover -s tests"""
import importlib.util
import json
import os
from pathlib import Path
import tempfile
import unittest

spec = importlib.util.spec_from_file_location('launcher', str(Path(__file__).resolve().parents[1] / 'launcher.py'))
launcher = importlib.util.module_from_spec(spec)
spec.loader.exec_module(launcher)


class StorageTests(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.path = Path(self.temporary.name) / 'data'
        self.data = {'version': 1, 'active': 'one', 'profiles': [{'id': 'one', 'name': 'Zoë'}], 'settings': {}}

    def tearDown(self):
        self.temporary.cleanup()

    def test_roundtrip_and_replace(self):
        launcher.save_state(self.path, json.dumps(self.data))
        self.assertEqual(launcher.load_state(self.path), (self.data, None))
        self.data['profiles'][0]['name'] = 'Milo'
        launcher.save_state(self.path, json.dumps(self.data))
        self.assertEqual(launcher.load_state(self.path)[0], self.data)
        self.assertEqual(list(self.path.iterdir()), [self.path / 'profiles.json'])
        self.assertEqual((self.path / 'profiles.json').stat().st_mode & 0o777, 0o600)

    def test_bad_save_preserves_good_file(self):
        launcher.save_state(self.path, json.dumps(self.data))
        for raw in ['invalid', '{"version":2}', 'x' * 262145]:
            with self.assertRaises(ValueError):
                launcher.save_state(self.path, raw)
            self.assertEqual(launcher.load_state(self.path)[0], self.data)

    def test_corruption_keeps_recovery_copy(self):
        self.path.mkdir()
        (self.path / 'profiles.json').write_text('broken')
        value, error = launcher.load_state(self.path)
        self.assertIsNone(value)
        self.assertTrue(error)
        self.assertEqual((self.path / 'profiles.recovery.json').read_text(), 'broken')

    def test_empty_install(self):
        self.assertEqual(launcher.load_state(self.path), (None, None))


if __name__ == '__main__':
    unittest.main()
