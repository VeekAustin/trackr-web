import { title } from "node:process"

const Post = ({ post }) => {
    return(
        <div>
            <p>title: {post.title}</p>
            <p>desc: {post.desc}</p>
            <p>creator: {post.creator}</p>
            <p>date: {post.date}</p>
        </div>
    )
};
export default function PostLists() {
    const myPost = [
        {
            id: 1, 
            title:"First Post", 
            desc: "This is the description of my first post",
            creator: "Otobong Inyang",
            date: "2026-01-14"
        },
        {
            id: 2, 
            title:"Learning React", 
            desc: "Reacts is a powerful library for building UIs",
            creator: "Augustine Ediomo",
            date: "2026-01-15"
        },
        {
            id: 3, 
            title:"Next.js Tips", 
            desc: "Next.js makes React development easier",
            creator: "Chika Udom",
            date: "2026-01-13"
        },
        {
            id: 4, 
            title:"Next.js Assignment ", 
            desc: "create three components counter, loginform, postlist respectively ",
            creator: "Victor Augutine",
            date: "2026-03-16"
        },
    ];
    return (
        <div style={{padding: '20px', border:'1px solid #ddd', margin:'10px'}}>
            <h2>Timeline</h2>
            
            {myPost.map((post, id) => (
                <div key={post.id} style={{border:'1px solid #eee', padding:'10px', margin:'10px 0', borderRadius:'5px'}}>
                    <h3>{post.title}</h3>
                    <p><strong>Description:</strong>{post.desc}</p>
                    
                    <p><strong>creator:</strong>{post.creator}</p>
                    <p><strong>date:</strong>{post.date}</p>
                </div>
            ))}
        </div>
    );
}