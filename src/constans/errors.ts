type TError = {
	[key: string]: string
}

export const errors: TError = {
	'auth/user-not-found': 'Пользователь не найден. Проверьте email и повторите попытку.',
	'auth/wrong-password': 'Указан неверный пароль. Проверьте пароль и повторите попытку.',
	'auth/email-already-in-use': 'Указанный email уже используется другой учетной записью. ' +
		'Проверьте email и повторите попытку.',
};

