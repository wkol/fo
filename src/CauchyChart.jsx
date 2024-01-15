const generateCauchyData = (x0, gamma, size = 1000) => {
    let data = [];
    for (let i = 0; i < size; i++) {
        let randomNumber = Math.random();
        data.push(x0 + gamma * Math.tan(Math.PI * (randomNumber - 0.5)));
    }
    return data;
};
