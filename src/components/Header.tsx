import { IMG_LOGO } from '../lib/config';

export default function Header() {
  return (
    <div className='mt-4 mb-8 flex flex-row items-center justify-between rounded-xl bg-bgDarker bg-contain bg-center bg-no-repeat px-8 mobile:flex-wrap mobile:justify-center'>
      <div className='md:mr-5 md:max-w-md'>
        <h1 className='text-white'>
          A matter of minutes. And zero developing costs. Want to build your own NFT collection?
        </h1>
        <a
          href='https://apillon.io/'
          className='inline-block text-sm font-bold leading-6 text-yellow transition-all duration-300 ease-in-out hover:bg-yellow hover:text-bgDarker'
          target='_blank'
          rel='noreferrer'
        >
          Build with Apillon
        </a>
      </div>
      <div className='inline-flex'>
        <img src={IMG_LOGO || '/assets/images/header.svg'} height={126} alt='Apillon Logo' />
      </div>
    </div>
  );
}
