import { reducerWithInitialState } from "typescript-fsa-reducers";
import posts from "../../stores/post";

export interface AppState {
  posts: Post[];
}

export interface Post {
  title: string;
  slug: string;
  date: string;
  contents: string;
}

export const initialState: AppState = {
  posts
};

export const Reducer = reducerWithInitialState(initialState);
