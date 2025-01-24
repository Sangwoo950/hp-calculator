import React, { useState } from 'react';

export default function Home() {
  const [senderData, setSenderData] = useState('');
  const [responseData, setResponseData] = useState('');
  const [duplicateData, setDuplicateData] = useState('');
  const [nonDuplicateData, setNonDuplicateData] = useState('');
  const [summaryData, setSummaryData] = useState('');
  const [dataType, setDataType] = useState<'phone' | 'payment'>('phone'); // 데이터 유형을 위한 상태
  const [displayOption, setDisplayOption] = useState<
    'duplicates' | 'nonDuplicates'
  >('nonDuplicates'); // 표시 옵션 상태

  // 데이터 유형에 따라 데이터를 포맷팅하는 함수
  const formatData = (data: string): string[] => {
    return data
      .split(/\s+|,/)
      .map((item) => item.replace(/[^0-9]/g, '').trim())
      .filter((item) => item)
      .map((item) => {
        if (dataType === 'phone') {
          return item.slice(-8); // 핸드폰 번호의 경우 마지막 8자리 추출
        } else {
          return item.slice(0, 8); // 결제 번호의 경우 처음 8자리 추출
        }
      });
  };

  // 데이터 유효성 검사 함수 (옵션)
  const validateData = (data: string): boolean => {
    const formattedData = formatData(data);
    if (dataType === 'phone') {
      // 핸드폰 번호는 슬라이싱 후 8자리이어야 함
      return formattedData.every((item) => item.length === 8);
    } else {
      // 결제 번호는 1~8자리 숫자이어야 함
      return formattedData.every(
        (item) => item.length <= 8 && item.length >= 1
      );
    }
  };

  const handleCalculate = (): void => {
    if (!validateData(senderData) || !validateData(responseData)) {
      alert('입력된 데이터 형식이 올바르지 않습니다.');
      return;
    }

    const senderArray = formatData(senderData);
    const responseArray = formatData(responseData);

    const duplicates = [
      ...new Set(senderArray.filter((item) => responseArray.includes(item))),
    ];

    const nonDuplicates = [
      ...new Set(senderArray.filter((item) => !responseArray.includes(item))),
    ];

    const formattedNonDuplicates =
      dataType === 'phone'
        ? nonDuplicates.map((item) => `010${item}`)
        : nonDuplicates;

    const summary = `입력 ${senderArray.length}개, 응답 ${responseArray.length}개, 중복 ${duplicates.length}개, 최종 ${formattedNonDuplicates.length}개`;

    setDuplicateData(duplicates.join(', '));
    setNonDuplicateData(formattedNonDuplicates.join('\n'));
    setSummaryData(summary);
  };

  const handleCopy = (): void => {
    navigator.clipboard
      .writeText(
        displayOption === 'duplicates' ? duplicateData : nonDuplicateData
      )
      .then(() => {
        alert('복사되었습니다.');
      });
  };

  return (
    <article className='container mx-auto p-8 bg-gray-100 rounded-lg shadow-md'>
      <h1 className='text-center text-3xl font-bold text-gray-800 mb-6'>
        Calculator Assistant
      </h1>

      {/* 데이터 유형 선택 섹션 */}
      <div className='mb-6'>
        <label className='block text-lg font-semibold text-gray-700 mb-2'>
          데이터 유형 선택
        </label>
        <div className='flex items-center space-x-4'>
          <label className='flex items-center'>
            <input
              type='radio'
              name='dataType'
              value='phone'
              checked={dataType === 'phone'}
              onChange={() => setDataType('phone')}
              className='form-radio h-5 w-5 text-blue-600'
            />
            <span className='ml-2 text-gray-700'>핸드폰 번호</span>
          </label>
          <label className='flex items-center'>
            <input
              type='radio'
              name='dataType'
              value='payment'
              checked={dataType === 'payment'}
              onChange={() => setDataType('payment')}
              className='form-radio h-5 w-5 text-blue-600'
            />
            <span className='ml-2 text-gray-700'>결제 번호</span>
          </label>
        </div>
      </div>

      {/* 표시 옵션 선택 섹션 */}
      <div className='mb-6'>
        <label className='block text-lg font-semibold text-gray-700 mb-2'>
          표시할 데이터 선택
        </label>
        <div className='flex items-center space-x-4'>
          <label className='flex items-center'>
            <input
              type='radio'
              name='displayOption'
              value='duplicates'
              checked={displayOption === 'duplicates'}
              onChange={() => setDisplayOption('duplicates')}
              className='form-radio h-5 w-5 text-blue-600'
            />
            <span className='ml-2 text-gray-700'>중복 데이터</span>
          </label>
          <label className='flex items-center'>
            <input
              type='radio'
              name='displayOption'
              value='nonDuplicates'
              checked={displayOption === 'nonDuplicates'}
              onChange={() => setDisplayOption('nonDuplicates')}
              className='form-radio h-5 w-5 text-blue-600'
            />
            <span className='ml-2 text-gray-700'>중복되지 않은 데이터</span>
          </label>
        </div>
      </div>

      {/* 비교군 A 입력 섹션 */}
      <div className='mb-6'>
        <label className='block text-lg font-semibold text-gray-700 mb-2'>
          비교군 A (data)
        </label>
        <textarea
          className='w-full max-w-md mx-auto p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
          value={senderData}
          onChange={(e) => setSenderData(e.target.value)}
          rows={4}
          placeholder={
            dataType === 'phone'
              ? '핸드폰 번호를 입력하세요 (예: 01012345678)'
              : '결제 번호를 입력하세요 (1~8자리 숫자)'
          }
        />
      </div>

      {/* 비교군 B 입력 섹션 */}
      <div className='mb-6'>
        <label className='block text-lg font-semibold text-gray-700 mb-2'>
          비교군 B (data)
        </label>
        <textarea
          className='w-full max-w-md mx-auto p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
          value={responseData}
          onChange={(e) => setResponseData(e.target.value)}
          rows={4}
          placeholder={
            dataType === 'phone'
              ? '핸드폰 번호를 입력하세요 (예: 01087654321)'
              : '결제 번호를 입력하세요 (1~8자리 숫자)'
          }
        />
      </div>

      {/* Calculate 버튼 */}
      <button
        className='w-full bg-blue-600 text-white py-3 rounded-md font-bold text-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'
        onClick={handleCalculate}
      >
        Calculate
      </button>

      {/* 요약 섹션 */}
      <div className='mt-6'>
        <h2 className='text-lg font-semibold text-gray-700 mb-2'>Summary:</h2>
        <p className='text-gray-800 mb-4 whitespace-pre-wrap'>{summaryData}</p>
      </div>

      {/* 결과 데이터 섹션 */}
      <div className='mt-6'>
        <label className='block text-lg font-semibold text-gray-700 mb-2'>
          {displayOption === 'duplicates'
            ? '중복 데이터:'
            : '중복되지 않은 데이터:'}
        </label>
        <textarea
          className='w-full p-4 border border-gray-300 rounded-md bg-gray-200 text-gray-700 focus:outline-none'
          value={
            displayOption === 'duplicates' ? duplicateData : nonDuplicateData
          }
          readOnly
          rows={displayOption === 'duplicates' ? 4 : 10}
        />
        <button
          className='mt-4 w-full bg-green-600 text-white py-3 rounded-md font-bold text-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50'
          onClick={handleCopy}
        >
          {displayOption === 'duplicates'
            ? '중복 데이터 복사하기'
            : '발송 대상 번호 복사하기'}
        </button>
      </div>
    </article>
  );
}
