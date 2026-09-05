import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import jwt from 'jsonwebtoken';
import { hashPassword, comparePassword } from '../../src/utils/password.js';
import { signAccessToken, signRefreshToken, verifyAccessToken, verifyRefreshToken } from '../../src/utils/jwt.js';
import { env } from '../../src/config/env.js';

describe('Auth Utilities - Unit Tests', () => {
  describe('Password Hashing & Comparison', () => {
    test('hashes password using bcrypt with salt', async () => {
      const plain = 'SecretChef123!';
      const hash = await hashPassword(plain);

      assert.notEqual(hash, plain);
      assert.ok(hash.startsWith('$2')); // bcrypt salt prefix
    });

    test('generates different hashes for identical passwords due to salting', async () => {
      const plain = 'SecretChef123!';
      const hash1 = await hashPassword(plain);
      const hash2 = await hashPassword(plain);

      assert.notEqual(hash1, hash2);
    });

    test('correctly verifies valid password against hash', async () => {
      const plain = 'AtelierCulinaryPassword2026';
      const hash = await hashPassword(plain);
      const isValid = await comparePassword(plain, hash);

      assert.equal(isValid, true);
    });

    test('rejects invalid password against hash', async () => {
      const plain = 'ValidPassword123';
      const hash = await hashPassword(plain);
      const isValid = await comparePassword('WrongPassword456', hash);

      assert.equal(isValid, false);
    });
  });

  describe('JWT Token Generation & Verification', () => {
    const mockUser = {
      id: 'usr_test_12345',
      email: 'chef@foodtailor.in',
      role: 'PARTNER',
    };

    test('generates valid access token containing claims', () => {
      const token = signAccessToken(mockUser);
      assert.ok(typeof token === 'string' && token.length > 20);

      const decoded = verifyAccessToken(token);
      assert.ok(decoded);
      assert.equal(decoded.sub, mockUser.id);
      assert.equal(decoded.email, mockUser.email);
      assert.equal(decoded.role, mockUser.role);
    });

    test('generates valid refresh token with refresh type', () => {
      const token = signRefreshToken(mockUser.id);
      assert.ok(typeof token === 'string');

      const decoded = verifyRefreshToken(token);
      assert.ok(decoded);
      assert.equal(decoded.sub, mockUser.id);
      assert.equal(decoded.type, 'refresh');
    });

    test('returns null for tampered token', () => {
      const token = signAccessToken(mockUser);
      const tampered = token.slice(0, -5) + 'abcde';
      const decoded = verifyAccessToken(tampered);

      assert.equal(decoded, null);
    });

    test('returns null for arbitrary invalid string', () => {
      assert.equal(verifyAccessToken('not.a.valid.jwt.token'), null);
      assert.equal(verifyRefreshToken('invalid-refresh-token'), null);
    });

    test('rejects expired token', () => {
      // Create an immediately expired token using the same secret
      const expiredToken = jwt.sign(
        { sub: mockUser.id, role: mockUser.role },
        env.JWT_ACCESS_SECRET,
        { expiresIn: '0s' }
      );

      const decoded = verifyAccessToken(expiredToken);
      assert.equal(decoded, null);
    });
  });
});
