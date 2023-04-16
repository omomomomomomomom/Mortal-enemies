
const read = async() => {
    const req = await fetch("http://127.0.0.1:3000/read");
    const data = await req.json();
    return data;
};



export default read();