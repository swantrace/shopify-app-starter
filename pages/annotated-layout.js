function AnnotatedLayout() {
  return <div>AnnotatedLayout</div>;
}

export default AnnotatedLayout;

export async function getServerSideProps(ctx) {
  console.log(ctx.resolvedUrl);
  return {
    props: {},
  };
}
