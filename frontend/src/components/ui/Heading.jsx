function Heading({ text, className }) {
  return <h1 className={`text-2xl leading-8 tracking-tight font-bold ${className}`}>{text}</h1>;
}

export default Heading;
