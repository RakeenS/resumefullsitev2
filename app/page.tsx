'use client';

import { motion } from 'framer-motion';
import { ArrowRightIcon, DocumentTextIcon, SparklesIcon, UserGroupIcon, ChartBarIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import Image from 'next/image';

const stats = [
  { id: 1, name: 'Resumes Created', value: '10,000+' },
  { id: 2, name: 'Success Rate', value: '85%' },
  { id: 3, name: 'Happy Users', value: '5,000+' },
  { id: 4, name: 'Industries Covered', value: '50+' },
];

const features = [
  {
    name: 'AI-Powered Content',
    description: 'Our advanced AI helps you write compelling bullet points and optimize your content for maximum impact.',
    icon: SparklesIcon,
  },
  {
    name: 'ATS-Friendly Templates',
    description: 'Professional templates designed to pass Applicant Tracking Systems and catch the recruiter\'s eye.',
    icon: DocumentTextIcon,
  },
  {
    name: 'Real-Time Analytics',
    description: 'Get instant feedback on your resume\'s effectiveness and suggestions for improvement.',
    icon: ChartBarIcon,
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

      {/* Hero Section */}
      <div className="relative isolate px-6 pt-14 lg:px-8">
        {/* Gradient Blob */}
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
        </div>

        <div className="mx-auto max-w-6xl py-32 sm:py-48 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mx-auto h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-8"
            >
              <DocumentTextIcon className="h-6 w-6 text-blue-400" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white text-center tracking-tight"
            >
              Create Your Perfect{' '}
              <span className="bg-gradient-to-r from-blue-400 to-purple-600 text-transparent bg-clip-text">
                Resume
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 text-lg sm:text-xl leading-8 text-gray-300 max-w-2xl mx-auto"
            >
              Transform your career with our AI-powered resume builder. Create professional, 
              ATS-friendly resumes tailored to your industry in minutes.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-10 flex items-center justify-center gap-x-6"
            >
              <Link
                href="/builder"
                className="group relative inline-flex items-center gap-x-2 rounded-full px-8 py-4 text-base font-semibold text-white shadow-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 transition-all duration-300 hover:shadow-blue-500/20 hover:shadow-2xl"
              >
                Get Started
                <ArrowRightIcon className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="#features"
                className="text-base font-semibold leading-6 text-gray-300 hover:text-white transition-colors flex items-center gap-x-1"
              >
                Learn more
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  →
                </motion.span>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom Gradient Blob */}
        <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
          <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" />
        </div>
      </div>

      {/* Stats Section */}
      <div className="relative isolate -mt-12 sm:-mt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-7xl px-6 lg:px-8"
        >
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <div className="text-center">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-3xl font-bold tracking-tight text-white sm:text-4xl"
              >
                Trusted by thousands of job seekers
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-4 text-lg leading-8 text-gray-300"
              >
                Join our growing community of successful professionals
              </motion.p>
            </div>
            <dl className="mt-16 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="flex flex-col bg-white/5 p-8 backdrop-blur-lg"
                >
                  <dt className="text-sm font-semibold leading-6 text-gray-300">{stat.name}</dt>
                  <dd className="order-first text-3xl font-semibold tracking-tight text-white">{stat.value}</dd>
                </motion.div>
              ))}
            </dl>
          </div>
        </motion.div>
        <div className="absolute left-1/2 top-0 -z-10 -translate-x-1/2 blur-3xl xl:-top-6" aria-hidden="true">
          <div
            className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-24 sm:py-32 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl font-bold tracking-tight text-white sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-purple-200"
            >
              Everything you need to succeed
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-lg leading-8 text-gray-300"
            >
              Our AI-powered platform helps you create professional resumes that stand out and get noticed.
            </motion.p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="group relative flex flex-col bg-gray-800/50 rounded-2xl p-8 backdrop-blur-sm border border-gray-700 hover:bg-gray-800/70 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/5"
                >
                  <div className="mb-6">
                    <div className="rounded-lg bg-blue-500/10 p-3 w-fit">
                      <feature.icon className="h-6 w-6 text-blue-400" aria-hidden="true" />
                    </div>
                  </div>
                  <dt className="text-xl font-semibold leading-7 text-white">
                    {feature.name}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-300">
                    <p className="flex-auto">{feature.description}</p>
                  </dd>
                  <div className="mt-6 flex items-center gap-x-3">
                    <div className="h-px flex-auto bg-gray-700" />
                  </div>
                </motion.div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="relative isolate mt-32 px-6 py-32 sm:mt-56 sm:py-40 lg:px-8"
      >
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-3xl" />
        </div>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to take your career to the next level?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-300">
            Join thousands of professionals who have already transformed their careers with our AI-powered resume builder.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/builder"
              className="group relative inline-flex items-center gap-x-2 rounded-full px-8 py-4 text-base font-semibold text-white shadow-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 transition-all duration-300 hover:shadow-blue-500/20 hover:shadow-2xl"
            >
              Start Building Now
              <ArrowRightIcon className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
