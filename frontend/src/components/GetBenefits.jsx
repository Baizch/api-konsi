import { useState } from 'react';
import axios from 'axios';

import { FormatCPF } from '../utils/FormatCpf';

const GetBenefits = () => {
  const [cpf, setCpf] = useState('');
  const [benefits, setBenefits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBenefits = async () => {
    setLoading(true);
    setError(null);

    if (cpf) {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/get-benefits?cpf=${cpf}`
        );
        if (response.data.success) {
          const benefitsData = response.data.data
            .map((item) => item.benefits)
            .flat();

          setBenefits(benefitsData);
        } else {
          setError('Nenhum benefício encontrado para o CPF informado');
        }
      } catch (error) {
        setError(
          'Erro ao buscar benefícios. CPF inválido ou inexistente',
          error
        );
      } finally {
        setLoading(false);
      }
    } else {
      setError('Por favor, insira um CPF.');
      setLoading(false);
    }
  };

  const handleCPFChange = (e) => {
    const value = e.target.value;
    const formattedCPF = FormatCPF(value);
    setCpf(formattedCPF);
  };

  return (
    <div className='flex flex-col justify-center items-center w-full h-screen bg-gray-100'>
      <h2 className='text-2xl font-bold mb-8'>Consultar Benefícios</h2>

      <div className='flex items-center space-x-4'>
        <input
          type='text'
          placeholder='Digite o CPF'
          value={cpf}
          onChange={handleCPFChange}
          maxLength={14}
          className='px-4 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring focus:ring-blue-300'
        />
        <button
          onClick={fetchBenefits}
          className='px-6 py-2 bg-blue-500 text-white font-medium rounded hover:bg-blue-600 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300'
        >
          Buscar
        </button>
      </div>

      {loading && <p className='mt-4'>Carregando...</p>}

      {error && <p className='mt-4 text-red-500 '>{error}</p>}

      <div>
        {benefits.length > 0 && !error && (
          <div>
            <h3 className='text-2xl font-bold mb-8 mt-8'>
              Benefícios encontrados:
            </h3>
            <ul className='space-y-4'>
              {benefits.map((benefit, index) => (
                <li
                  key={index}
                  className='border border-gray-300 rounded-lg p-4 shadow-md bg-white'
                >
                  <p className='mb-2'>
                    <strong>Matrícula:</strong> {benefit.numero_beneficio}
                  </p>
                  <p>
                    <strong>Código do tipo de benefício:</strong>{' '}
                    {benefit.codigo_tipo_beneficio}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default GetBenefits;
