function ContentWrapper({ children, className }) {
  return <section className={` mx-auto   ${className}`}>{children}</section>;
}

export default ContentWrapper;
