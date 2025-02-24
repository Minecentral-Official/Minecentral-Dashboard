const TitleBar = ({ title, aside }: { title: string; aside?: string }) => (
  <div className='mb-4'>
    <div className='flex items-center justify-between'>
      <h4 className='mb-2'>{title}</h4>
      {aside && <h6>{aside}</h6>}
    </div>
    <hr />
  </div>
);

export default TitleBar;
