type RateLimitConfig = {
	limit: number;
	window: number; // in seconds
};

const ipRequests = new Map<string, number[]>();

export function checkRateLimit(ip: string, config: RateLimitConfig): boolean {
	const now = Date.now();
	const windowStart = now - config.window * 1000;

	let timestamps = ipRequests.get(ip) || [];

	// Filter out old timestamps
	timestamps = timestamps.filter((t) => t > windowStart);

	if (timestamps.length >= config.limit) {
		return false;
	}

	timestamps.push(now);
	ipRequests.set(ip, timestamps);

	return true;
}
