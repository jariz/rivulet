const getPort = (): number => process.env.PORT ? parseInt(process.env.PORT!, 10) : 3000;

export default getPort();
