const getTodaysDate = () => {
	const today = new Date();
	const date = `${today.getFullYear()}-${
		today.getMonth() + 1
	}-${today.getDate()}`;
	const time = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;
	return `${date} ${time}`;
};

const stringIdGenerator = (charCount) => {
	let text = '';
	const possible =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

	for (let i = 0; i < charCount; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}

	return text;
};

export { getTodaysDate, stringIdGenerator };
