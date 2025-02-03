import React, { useState } from 'react';
import Image from 'next/image';

export default function Home() {
  // [번호 세탁기(필터) 관련 상태]
  const [senderData, setSenderData] = useState('');
  const [responseData, setResponseData] = useState('');
  const [duplicateData, setDuplicateData] = useState('');
  const [nonDuplicateData, setNonDuplicateData] = useState('');
  const [summaryData, setSummaryData] = useState('');

  // [서비스 선택 및 결과 표시 관련 상태]
  const [service, setService] = useState<'filter' | 'extractor'>('filter');
  const [displayOption, setDisplayOption] = useState<
    'duplicates' | 'nonDuplicates'
  >('nonDuplicates');

  // [랜덤번호 추출기 관련 상태]
  const [extractionData, setExtractionData] = useState('');
  const [extractionCount, setExtractionCount] = useState<number>(0);
  const [extractedNumbers, setExtractedNumbers] = useState('');

  // --- 공통 유틸리티 함수 ---
  const cleanNumbers = (data: string): string[] =>
    data
      .split(/[\n,]+/)
      .map((item) => item.replace(/[^0-9]/g, '').trim())
      .filter((item) => item.length > 0);

  const getNumberCount = (data: string): number => cleanNumbers(data).length;

  // 번호 세탁기용: 입력된 숫자 문자열에서 마지막 8자리를 추출
  const formatData = (data: string): string[] =>
    cleanNumbers(data).map((item) => item.slice(-8));

  // 번호 세탁기용: 데이터 정리 (하이픈, 공백 제거 후 쉼표로 연결)
  const sanitizeData = (data: string): string => cleanNumbers(data).join(', ');

  // 번호 세탁기용: 유효성 검사 (각 항목이 8자리인지 확인)
  const validateData = (
    data: string
  ): { valid: boolean; invalidItems: string[] } => {
    const formattedData = formatData(data);
    const invalidItems = formattedData.filter((item) => item.length !== 8);
    return { valid: invalidItems.length === 0, invalidItems };
  };

  // --- 번호 세탁기(필터) 관련 함수 ---
  const handleSanitize = (): void => {
    setSenderData(sanitizeData(senderData));
    setResponseData(sanitizeData(responseData));
    alert('데이터가 정렬되었습니다. 이제 계산 버튼을 클릭하세요.');
  };

  const handleCalculate = (): void => {
    const senderValidation = validateData(senderData);
    const responseValidation = validateData(responseData);
    if (!senderValidation.valid || !responseValidation.valid) {
      const errorMessages = [];
      if (!senderValidation.valid) {
        errorMessages.push(
          `비교군 A에 잘못된 데이터가 있습니다: ${senderValidation.invalidItems.join(
            ', '
          )}`
        );
      }
      if (!responseValidation.valid) {
        errorMessages.push(
          `비교군 B에 잘못된 데이터가 있습니다: ${responseValidation.invalidItems.join(
            ', '
          )}`
        );
      }
      alert(errorMessages.join('\n'));
      return;
    }

    const senderArray = formatData(senderData);
    const responseArray = formatData(responseData);
    const duplicates = Array.from(
      new Set(senderArray.filter((item) => responseArray.includes(item)))
    );
    const nonDuplicates = Array.from(
      new Set(senderArray.filter((item) => !responseArray.includes(item)))
    );
    const formattedNonDuplicates = nonDuplicates.map((item) => `010${item}`);

    setDuplicateData(duplicates.join(', '));
    setNonDuplicateData(formattedNonDuplicates.join('\n'));
    setSummaryData(
      `입력 ${senderArray.length}개, 응답 ${responseArray.length}개, 중복 ${duplicates.length}개, 최종 ${formattedNonDuplicates.length}개`
    );
  };

  const handleCopy = (): void => {
    const textToCopy =
      displayOption === 'duplicates' ? duplicateData : nonDuplicateData;
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => alert('복사되었습니다.'))
      .catch(() => alert('복사에 실패했습니다. 다시 시도해주세요.'));
  };

  // --- 랜덤번호 추출기 관련 함수 ---
  const shuffleArray = <T,>(array: T[]): T[] => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const handleExtractNumbers = (): void => {
    let items = cleanNumbers(extractionData);
    // 국제번호 처리: "82"로 시작하고 길이가 12인 경우 국내 형식으로 변환
    items = items.map((item) =>
      item.startsWith('82') && item.length === 12 ? '0' + item.slice(2) : item
    );
    const phoneNumbers = items.filter(
      (item) => item.startsWith('010') && item.length === 11
    );

    if (extractionCount <= 0) {
      alert('추출할 번호의 개수를 1 이상 입력하세요.');
      return;
    }
    if (extractionCount > phoneNumbers.length) {
      alert(
        `입력된 핸드폰 번호의 개수(${phoneNumbers.length})보다 더 많은 번호를 추출할 수 없습니다.`
      );
      return;
    }
    const shuffled = shuffleArray(phoneNumbers);
    const selected = shuffled.slice(0, extractionCount);
    setExtractedNumbers(selected.join(', '));
  };

  return (
    <article className='container mx-auto p-8 bg-gray-100 rounded-lg shadow-md'>
      <h1 className='text-center text-3xl font-bold text-gray-800 mb-6 flex justify-center items-center'>
        번호 세탁기
        <Image
          className='flex'
          src='/무.png'
          alt='Favicon Icon'
          width={32}
          height={32}
        />
      </h1>

      {/* 서비스 선택 */}
      <div className='mb-6'>
        <label className='block text-lg font-semibold text-gray-700 mb-2'>
          서비스 선택
        </label>
        <div className='flex items-center space-x-4'>
          <label className='flex items-center'>
            <input
              type='radio'
              name='service'
              value='filter'
              checked={service === 'filter'}
              onChange={() => setService('filter')}
              className='form-radio h-5 w-5 text-blue-600'
            />
            <span className='ml-2 text-gray-700'>번호 세탁기</span>
          </label>
          <label className='flex items-center'>
            <input
              type='radio'
              name='service'
              value='extractor'
              checked={service === 'extractor'}
              onChange={() => setService('extractor')}
              className='form-radio h-5 w-5 text-blue-600'
            />
            <span className='ml-2 text-gray-700'>랜덤번호 추출기</span>
          </label>
        </div>
      </div>

      {/* 번호 세탁기 UI */}
      {service === 'filter' && (
        <>
          <div className='mb-6'>
            <label className='block text-lg font-semibold text-gray-700 mb-2'>
              비교군 A (data)
            </label>
            <textarea
              className='w-full max-w-md mx-auto p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              value={senderData}
              onChange={(e) => setSenderData(e.target.value)}
              rows={4}
              placeholder='핸드폰 번호를 입력하세요 (예: 010-1234-5678 또는 01012345678)'
            />
          </div>
          <div className='mb-6'>
            <label className='block text-lg font-semibold text-gray-700 mb-2'>
              비교군 B (data)
            </label>
            <textarea
              className='w-full max-w-md mx-auto p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              value={responseData}
              onChange={(e) => setResponseData(e.target.value)}
              rows={4}
              placeholder='핸드폰 번호를 입력하세요 (예: 010-8765-4321 또는 01087654321)'
            />
          </div>
          <div className='flex flex-col space-y-4 mb-6'>
            <button
              className='w-full bg-yellow-500 text-white py-3 rounded-md font-bold text-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50'
              onClick={handleSanitize}
            >
              정렬 (Sanitize)
            </button>
            <button
              className='w-full bg-blue-600 text-white py-3 rounded-md font-bold text-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'
              onClick={handleCalculate}
            >
              계산 (Calculate)
            </button>
          </div>
          <div className='mt-6'>
            <h2 className='text-lg font-semibold text-gray-700 mb-2'>
              Summary:
            </h2>
            <p className='text-gray-800 mb-4 whitespace-pre-wrap'>
              {summaryData}
            </p>
          </div>
          <div className='mt-6'>
            <label className='block text-lg font-semibold text-gray-700 mb-2'>
              {displayOption === 'duplicates'
                ? '중복 데이터:'
                : '중복되지 않은 데이터:'}
            </label>
            <textarea
              className='w-full p-4 border border-gray-300 rounded-md bg-gray-200 text-gray-700 focus:outline-none'
              value={
                displayOption === 'duplicates'
                  ? duplicateData
                  : nonDuplicateData
              }
              readOnly
              rows={displayOption === 'duplicates' ? 4 : 10}
            />
            <button
              className='mt-4 w-full bg-green-600 text-white py-3 rounded-md font-bold text-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50'
              onClick={handleCopy}
            >
              {displayOption === 'duplicates'
                ? '중복 데이터 복사하기(copy)'
                : '발송 대상 번호 복사하기(copy)'}
            </button>
          </div>
        </>
      )}

      {/* 랜덤번호 추출기 UI */}
      {service === 'extractor' && (
        <div className='mt-8'>
          <label className='block text-lg font-semibold text-gray-700 mb-2'>
            랜덤번호 추출용 번호 입력
          </label>
          <textarea
            className='w-full max-w-md mx-auto p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            value={extractionData}
            onChange={(e) => setExtractionData(e.target.value)}
            rows={4}
            placeholder='번호를 입력하세요 (쉼표 또는 줄바꿈으로 구분)'
          />
          <p className='text-sm text-gray-500 mt-2'>
            입력된 번호 개수: {getNumberCount(extractionData)}개
          </p>
          <div className='mt-4'>
            <label className='block text-lg font-semibold text-gray-700 mb-2'>
              추출할 번호 개수
            </label>
            <input
              type='number'
              value={extractionCount}
              onChange={(e) => setExtractionCount(parseInt(e.target.value))}
              className='w-full max-w-md mx-auto p-2 border border-gray-300 rounded-md'
              placeholder='추출할 번호 개수를 입력하세요'
            />
          </div>
          <button
            className='w-full max-w-md mx-auto mt-4 bg-purple-600 text-white py-3 rounded-md font-bold text-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50'
            onClick={handleExtractNumbers}
          >
            랜덤번호 추출
          </button>
          {extractedNumbers && (
            <div className='mt-4'>
              <label className='block text-lg font-semibold text-gray-700 mb-2'>
                추출된 번호
              </label>
              <textarea
                className='w-full max-w-md mx-auto p-4 border border-gray-300 rounded-md bg-gray-200 text-gray-700'
                readOnly
                rows={extractedNumbers.split(', ').length}
                value={extractedNumbers}
              />
            </div>
          )}
        </div>
      )}
    </article>
  );
}
