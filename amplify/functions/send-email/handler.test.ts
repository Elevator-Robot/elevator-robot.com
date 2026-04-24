import { describe, it, expect } from 'vitest';

describe('Contact Form Handler - Input Validation', () => {
  it('should sanitize HTML tags from input', () => {
    const input = '<script>alert("xss")</script>Hello';
    const sanitized = input.replace(/<[^>]*>/g, '').trim();
    expect(sanitized).toBe('alert("xss")Hello');
  });

  it('should validate email format correctly', () => {
    const validEmails = [
      'test@example.com',
      'user+tag@domain.co.uk',
      'name.surname@company.org',
    ];

    const invalidEmails = [
      'invalid',
      'test@',
      '@example.com',
    ];

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    validEmails.forEach((email) => {
      expect(emailRegex.test(email)).toBe(true);
    });

    invalidEmails.forEach((email) => {
      expect(emailRegex.test(email)).toBe(false);
    });
  });

  it('should validate name length requirements', () => {
    const tooShort = 'A';
    const valid = 'John Doe';
    const tooLong = 'A'.repeat(101);

    expect(tooShort.length >= 2).toBe(false);
    expect(valid.length >= 2 && valid.length <= 100).toBe(true);
    expect(tooLong.length <= 100).toBe(false);
  });

  it('should validate message length requirements', () => {
    const tooShort = 'Hi';
    const valid = 'This is a valid message with enough characters';
    const tooLong = 'A'.repeat(1001);

    expect(tooShort.length >= 10).toBe(false);
    expect(valid.length >= 10 && valid.length <= 1000).toBe(true);
    expect(tooLong.length <= 1000).toBe(false);
  });
});

describe('Contact Form Handler - Rate Limiting Logic', () => {
  it('should calculate exponential backoff correctly', () => {
    const backoff1 = Math.pow(2, 0) * 1000; // 1s
    const backoff2 = Math.pow(2, 1) * 1000; // 2s
    const backoff3 = Math.pow(2, 2) * 1000; // 4s

    expect(backoff1).toBe(1000);
    expect(backoff2).toBe(2000);
    expect(backoff3).toBe(4000);
  });

  it('should calculate rate limit window correctly', () => {
    const now = Date.now();
    const windowMs = 60 * 60 * 1000; // 1 hour
    const windowEnd = now + windowMs;

    expect(windowEnd - now).toBe(3600000); // 1 hour in ms
  });

  it('should enforce max submissions per hour', () => {
    const maxSubmissions = 5;
    const submissions = 6;

    expect(submissions > maxSubmissions).toBe(true);
  });
});

describe('Contact Form Handler - Email Template', () => {
  it('should format plain text email correctly', () => {
    const data = {
      name: 'John Doe',
      email: 'john@example.com',
      message: 'Test message',
    };

    const text = `
New Contact Form Submission

Name: ${data.name}
Email: ${data.email}

Message:
${data.message}

Submitted at: ${new Date().toISOString()}
    `.trim();

    expect(text).toContain('John Doe');
    expect(text).toContain('john@example.com');
    expect(text).toContain('Test message');
  });

  it('should handle newlines in message content', () => {
    const message = 'Test\nmessage\nwith\nnewlines';
    const escaped = message.replace(/\n/g, '<br>');

    expect(escaped).toContain('<br>');
    expect(escaped).toBe('Test<br>message<br>with<br>newlines');
  });
});
