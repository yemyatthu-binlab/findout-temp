export const formatTimeLeft = (expiresAt: string | null): string => {
	if (!expiresAt) return '';

	const expiryDate = new Date(expiresAt);
	const now = new Date();
	const timeLeft = expiryDate.getTime() - now.getTime();

	if (timeLeft <= 0) return ''; // Poll ends //

	const hours = Math.floor(timeLeft / (1000 * 60 * 60));
	const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

	if (hours > 24) {
		const days = Math.floor(hours / 24);
		return `${days} days left`;
	}

	if (hours > 0) {
		return `${hours}h ${minutes}m left`;
	}

	return `${minutes}m left`;
};
