import { cleanText } from '../cleanText';

describe('cleanText', () => {
	it('should return empty string if input is null or undefined', () => {
		expect(cleanText('')).toBe('');
		// @ts-ignore
		expect(cleanText(null)).toBe('');
		// @ts-ignore
		expect(cleanText(undefined)).toBe('');
	});

	it('should remove HTML tags', () => {
		const html = '<p>Hello <b>World</b></p>';
		expect(cleanText(html)).toBe('Hello World');
	});

	it('should replace <br> with newlines', () => {
		const html = 'Hello<br>World<br/>Check';
		expect(cleanText(html)).toBe('Hello\nWorld\nCheck');
	});

	it('should decode HTML entities', () => {
		const html = 'Hello &amp; World';
		expect(cleanText(html)).toBe('Hello & World');
	});

	it('should trim whitespace', () => {
		const html = '  <p>  Hello  </p>  ';
		expect(cleanText(html)).toBe('Hello');
	});
});
