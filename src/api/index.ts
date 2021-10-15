import {useState, useEffect} from "preact/compat";

function fetch<T = any>(input: RequestInfo, init?: RequestInit): Promise<T> {
    return window.fetch(input, init).then(e => e.json()) as Promise<T>
}

export interface Story {
    by: string;
    descendants: number;
    id: number;
    kids: number[];
    score: number;
    time: number;
    title: string;
    type: string;
    url: string;
}

interface ApiRequest<T> {
    data: T | undefined;
    loading: boolean;
    error: Error | undefined;
}

const initialRequest: ApiRequest<any> = {
    data: undefined,
    error: undefined,
    loading: false,
}
export type Dict<T> = { [key: string]: T };

const StoryBank: Dict<Story> = {}

async function memoizeAsync <T>(key: string, bank: Dict<T>, fn: (key: string) => Promise<T>): Promise<T> {
    if (bank[key]) {
        return new Promise<T>((res) => res(bank[key]))
    } 
        return fn(key).then(e => {
            bank[key] = e
            return e as T
        })
    
}

async function getHeadlines(): Promise<number[]> {
    return await fetch<number[]>('https://hacker-news.firebaseio.com/v0/topstories.json');
}

async function getStory(key: string): Promise<Story> {
    return await fetch<Story>(`https://hacker-news.firebaseio.com/v0/item/${key}.json`);
}

export function useGetHeadlines(): ApiRequest<number[]> {
    const [req, setReq] = useState<ApiRequest<any>>({...initialRequest})

    useEffect(() => {
        setReq({
            data: undefined,
            loading: true,
            error: undefined
        })
        getHeadlines()
            .then(e => {
                setReq({
                    error: undefined,
                    loading: false,
                    data: e
                })
            })
            .catch(e => {
                setReq({
                    error: e,
                    loading: false,
                    data: undefined
                })
            })
    }, [])

    return req
}

export function useGetStory(id: string): ApiRequest<Story> {
    const [req, setReq] = useState<ApiRequest<Story>>({
        data: StoryBank[id],
        loading: false,
        error: undefined
    })

    useEffect(() => {
        if (!StoryBank[id]) {
            setReq({
                data: undefined,
                loading: true,
                error: undefined
            })

            memoizeAsync<Story>(id, StoryBank, getStory)
                .then(e => {
                    setReq({
                        error: undefined,
                        loading: false,
                        data: e
                    })
                })
                .catch(e => {
                    setReq({
                        error: e,
                        loading: false,
                        data: undefined
                    })
                })
        }
    }, [id])

    return req
}

