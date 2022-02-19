const API_KEY = process.env.REACT_APP_FIND_IMAGE_API_KEY as string;

class FindImageAPI {
	readonly API_KEY: string;

	constructor(API_KEY: string) {
		this.API_KEY = API_KEY;
	}

	getImage = async (request: string, abort: AbortSignal) : Promise<string> => {
		const response = await fetch(
			`https://api.unsplash.com/search/photos?query=${request}
			&order_by=relevant&orientation=landscape&client_id=${this.API_KEY}`
		,{
				signal: abort
			});
		const body = await response.json();
		return body.results[0].urls.regular
	};
}

export const findImageAPI = new FindImageAPI(API_KEY)