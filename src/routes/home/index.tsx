import {FunctionalComponent, h} from 'preact';
import {useGetHeadlines, useGetStory} from "../../api";
import {useState} from "preact/compat";

const PAGE_SIZE = 10

const Home: FunctionalComponent = () => {
    const {loading, data, error} = useGetHeadlines()
    const [page, setPage] = useState<number>(0)

    if (loading) {
        return <h1>Loading...</h1>
    }

    if (error || !data) {
        return <h1>Loading...</h1>
    }

    return (
        <div class={'home'}>
            <div class={'head'}>
                <h1>Hacker News</h1>
                <h3>Page {(page/PAGE_SIZE) + 1}</h3>
            </div>

            <div class={'body'}>
                {data.slice(page, page + PAGE_SIZE).map(e => <Story key={e} id={e.toString()} />)}
            </div>

            <div class={'footer'}>
                <div class={page > 0 ? 'active' : 'disabled'} onClick={() => setPage(page - PAGE_SIZE)}>Prev</div>
                <div class={page < (data.length - PAGE_SIZE) ? 'active' : 'disabled'}
                     onClick={() => setPage(page + PAGE_SIZE)}>Next
                </div>
            </div>
        </div>
    );
};

interface StoryProps {
    id: string;
}

const Story = (props: StoryProps) => {
    const {loading, data, error} = useGetStory(props.id)

    if (loading) {
        return <div class="loading">Loading...</div>
    }

    if (error || !data) {
        return <div class="loading">err</div>
    }

    return (<div class='story'>
            <div class='row1'>
                <span>{data.title}</span>
                <ExternalLink link={data.url} />
            </div>
            <div class='row2'>
                <div>By: {data.by}</div>
                <div>{(new Date(data.time * 1000)).toLocaleDateString()}</div>
            </div>
        </div>

    );
};

function ExternalLink(props: {link: string}) {
    return <div onClick={() => window.open(props.link)}>
        <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24"
             width="24px" fill="#000000">
            <rect fill="none" height="24" width="24" />
            <path
                d="M16.79,5.8L14,3h7v7l-2.79-2.8l-4.09,4.09l-1.41-1.41L16.79,5.8z M19,12v4.17l2,2V12H19z M19.78,22.61L18.17,21H5 c-1.11,0-2-0.9-2-2V5.83L1.39,4.22l1.41-1.41l18.38,18.38L19.78,22.61z M16.17,19l-4.88-4.88L9.7,15.71L8.29,14.3l1.59-1.59L5,7.83 V19H16.17z M7.83,5H12V3H5.83L7.83,5z" />
        </svg>
    </div>
}

export default Home;
