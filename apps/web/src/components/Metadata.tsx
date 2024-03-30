interface Props {
  title?: string;
}

const defaultMeta = {
  title: "XD Internal",
};

const Metadata = ({ title }: Props) => {
  return (
    <>
      <meta charSet="utf-8" />
      <title>{title || defaultMeta.title}</title>
    </>
  );
};

export default Metadata;
