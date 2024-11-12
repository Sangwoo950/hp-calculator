import React, { useState } from 'react';

export default function Home() {
  const [senderData, setSenderData] = useState('');
  const [responseData, setResponseData] = useState('');
  const [duplicateData, setDuplicateData] = useState('');
  const [nonDuplicateData, setNonDuplicateData] = useState('');
  const [summaryData, setSummaryData] = useState('');

  const formatData = (data: string): string[] => {
    return data
      .split(/\s+|,/)
      .map((item) => item.replace(/[^0-9]/g, '').trim())
      .filter((item) => item)
      .map((item) => item.slice(-8));
  };

  const handleCalculate = (): void => {
    const senderArray = formatData(senderData);
    const responseArray = formatData(responseData);

    const duplicates = [
      ...new Set(senderArray.filter((item) => responseArray.includes(item))),
    ];

    const nonDuplicates = [
      ...new Set(senderArray.filter((item) => !responseArray.includes(item))),
    ].map((item) => `010${item}`);

    const summary = `입력 ${senderArray.length}개, 응답 ${responseArray.length}개, 중복 ${duplicates.length}개, 최종 ${nonDuplicates.length}개`;

    setDuplicateData(duplicates.join(', '));
    setNonDuplicateData(nonDuplicates.join('\n'));
    setSummaryData(summary);
  };

  const handleCopy = (): void => {
    navigator.clipboard.writeText(nonDuplicateData).then(() => {
      alert('발송 대상번호가 복사되었습니다.');
    });
  };

  return (
    <article className='container mx-auto p-8 bg-gray-100 rounded-lg shadow-md'>
      <h1 className='text-center text-3xl font-bold text-gray-800 mb-6'>
        HP Calculator
      </h1>
      <div className='mb-6'>
        <label className='block text-lg font-semibold text-gray-700 mb-2'>
          발송번호 전체 Data:
        </label>
        <textarea
          className='w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
          value={senderData}
          onChange={(e) => setSenderData(e.target.value)}
          rows={4}
        />
      </div>
      <div className='mb-6'>
        <label className='block text-lg font-semibold text-gray-700 mb-2'>
          응답번호 Data:
        </label>
        <textarea
          className='w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
          value={responseData}
          onChange={(e) => setResponseData(e.target.value)}
          rows={4}
        />
      </div>
      <button
        className='w-full bg-blue-600 text-white py-3 rounded-md font-bold text-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'
        onClick={handleCalculate}
      >
        Calculate
      </button>
      <div className='mt-6'>
        <h2 className='text-lg font-semibold text-gray-700 mb-2'>Summary:</h2>
        <p className='text-gray-800 mb-4 whitespace-pre-wrap'>{summaryData}</p>
      </div>
      <div className='mt-6'>
        <label className='block text-lg font-semibold text-gray-700 mb-2'>
          제외 처리되는 응답번호 Data(Responded):
        </label>
        <textarea
          className='w-full p-4 border border-gray-300 rounded-md bg-gray-200 text-gray-700 focus:outline-none'
          value={duplicateData}
          readOnly
          rows={4}
        />
      </div>
      <div className='mt-6'>
        <label className='block text-lg font-semibold text-gray-700 mb-2'>
          발송 대상번호 Data(Did Not Respond):
        </label>
        <textarea
          className='w-full p-4 border border-gray-300 rounded-md bg-gray-200 text-gray-700 focus:outline-none'
          value={nonDuplicateData}
          readOnly
          rows={10}
        />
        <button
          className='mt-4 w-full bg-green-600 text-white py-3 rounded-md font-bold text-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50'
          onClick={handleCopy}
        >
          발송대상 번호 복사하기
        </button>
      </div>
    </article>
  );
}
