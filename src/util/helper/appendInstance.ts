export const appendInstance = (
	username: string,
	userOriginInstance: string,
) => {
	const regex = /^@\w+$/;

	if (regex.test(username)) {
		return `${username}${userOriginInstance}`;
	}
	return username;
};
