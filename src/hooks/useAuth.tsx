import { FC, useState, useEffect, useContext, createContext } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';

firebase.initializeApp({
	apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
	authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
	databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
	projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
	storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.REACT_APP_FIREBASE_APP_ID,
});

export type User = firebase.User | null | false;

export interface IAuthContext {
	user: User;
	signin: (email: string, password: string) => Promise<firebase.User | null>;
	signup: (email: string, password: string) => Promise<firebase.User | null>;
	signout: () => Promise<void>;
	sendPasswordResetEmail: (email: string) => Promise<boolean>;
	confirmPasswordReset: (code: string, password: string) => Promise<boolean>;
}

const useProvideAuth = () => {
	const [user, setUser] = useState<User>(null);

	const signin = (email: string, password: string) => {
		return firebase
			.auth()
			.signInWithEmailAndPassword(email, password)
			.then((response) => {
				setUser(response.user);
				return response.user;
			});
	};

	const signup = (email: string, password: string) => {
		return firebase
			.auth()
			.createUserWithEmailAndPassword(email, password)
			.then((response) => {
				setUser(response.user);
				return response.user;
			});
	};

	const signout = () => {
		return firebase
			.auth()
			.signOut()
			.then(() => {
				setUser(false);
			});
	};

	const sendPasswordResetEmail = (email: string) => {
		return firebase
			.auth()
			.sendPasswordResetEmail(email)
			.then(() => {
				return true;
			});
	};

	const confirmPasswordReset = (code: string, password: string) => {
		return firebase
			.auth()
			.confirmPasswordReset(code, password)
			.then(() => {
				return true;
			});
	};

	useEffect(() => {
		const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				setUser(user);
			} else {
				setUser(false);
			}
		});

		return () => unsubscribe();
	}, []);

	return {
		user,
		signin,
		signup,
		signout,
		sendPasswordResetEmail,
		confirmPasswordReset,
	};
};

const AuthContext = createContext<IAuthContext | null>(null);

export const useAuth = () => {
	return useContext(AuthContext);
};

export const ProvideAuth: FC = ({ children }) => {
	const auth = useProvideAuth();

	return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};
