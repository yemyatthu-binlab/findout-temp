export const isAccount = (user: any): user is Patchwork.Account => {
	return (
		user &&
		typeof user.display_name === 'string' &&
		typeof user.username === 'string' &&
		Array.isArray(user.fields)
	);
};
