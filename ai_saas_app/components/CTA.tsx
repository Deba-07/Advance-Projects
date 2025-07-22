import Image from 'next/image'
import Link from 'next/link'

const CTA = () => {
  return (
    <section className='cta-section'>
      <div className='cta-badge'>Start Learning Your Way.</div>
      <h2 className='text-xl font-bold'>Build and Personalize Your Learning Companion</h2>
      <p className='italic'>Pick a name, subject, voice and personality - and start learning through voice conversations that feel natural and fun.</p>
      <Image src="/images/cta.svg" alt='cta' width={362} height={232} />
      <button className='btn-primary bg-orange-500'>
        <Image src="/icons/plus.svg" alt="plus" width={12} height={12} />
        <Link href="/companions/new">
          <p className='text-blue-50 font-bold'>Build a New Companion</p>
        </Link>
      </button>
    </section>
  )
}

export default CTA