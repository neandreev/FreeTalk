const API_KEY = process.env.REACT_APP_FIND_HYPONEMES_API_KEY as string;

class FindHyponemesAPI {
	readonly API_KEY: string;

	constructor(API_KEY: string) {
		this.API_KEY = API_KEY;
	}

	getHyponemes = async (word: string, abort: AbortSignal) : Promise<string[]> => {

		const response = await fetch(`https://wordsapiv1.p.rapidapi.com/words/${word}/hasTypes`, {
			method: 'GET',
			headers: {
				'x-rapidapi-host': 'wordsapiv1.p.rapidapi.com',
				'x-rapidapi-key': this.API_KEY
			},
			signal: abort,
		});

		const body = await response.json();
		const hasTypes = [...body.hasTypes];

		return hasTypes
			.filter((item: string) => item.split(' ').length === 1)
			.slice(0, 4);
	};

}

export const findHyponemesAPI = new FindHyponemesAPI(API_KEY);
