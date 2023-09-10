import { FormEvent, useState } from 'react';
import './App.css';
import { gql, useQuery } from '@apollo/client';

type Country = {
  [key: string]: any;
  name: string;
  capital: string;
  emoji: string;
  currency: string;
  languages: {
    code: string;
    name: string;
  }[];
};

const GET_COUNTRIES = gql`
  query GetCountries {
    countries {
      name
      capital
      emoji
      currency
      languages {
        code
        name
      }
    }
  }
`;

function App() {
  const { loading, error, data } = useQuery(GET_COUNTRIES);

  const [selected, setSelected] = useState<number | null>(null);
  const [inputValue1, setInputValue1] = useState<string>('');
  const [inputValue2, setInputValue2] = useState<string>('');
  const [isFiltered, setIsFiltered] = useState<boolean>(false);
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([]);




  if (loading) return <p className='flex justify-center'>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  if (data && data.countries) {
    let bgColorIndex: number = 0;

    const handleForm = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const filteredData = data.countries.filter(function (item: Country) {
        setIsFiltered(false);
        if (inputValue2.toLowerCase() === "language") {
          return item.languages.some((language: any) =>
            language.name.toLowerCase().includes(inputValue1.toLowerCase())
          );
        } else {
          return item[inputValue2.toLowerCase()]?.toLowerCase().includes(inputValue1.toLowerCase());
        }
      });

      setIsFiltered(true);
      setFilteredCountries(filteredData);
    };

    const allDatas = () => {
      setIsFiltered(false);
    }

    if (data.countries.length >= 10 && isFiltered === false) {
      bgColorIndex = 9;
    } else if (isFiltered === false && data.countries.length < 10) {
      bgColorIndex = data.countries.length - 1;
    } else if (isFiltered === true && filteredCountries.length >= 10) {
      bgColorIndex = bgColorIndex = 9;
    } else if (isFiltered === true && filteredCountries.length < 10) {
      bgColorIndex = filteredCountries.length - 1;
    }

    return (
      <div>
        <form className='pt-10 px-52 flex' onSubmit={handleForm}>
          <div className="relative  w-full mb-6 group">
            <input type="text" name="dataName" id="dataName" onChange={(e) => setInputValue1(e.target.value)}
              className="block py-2.5 px-0 w-52 text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" 
              placeholder=" " required />
            <label htmlFor="dataName" className="peer-focus:font-medium absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 
            origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 
            peer-focus:-translate-y-6">Search item</label>
          </div>
          <div className="relative z-0 w-full mb-6 group">
            <input type="text" name="dataGroupName" id="dataGroupName" onChange={(e) => setInputValue2(e.target.value)}
              className="block py-2.5 px-0 w-52 text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" 
              placeholder=" " required />
            <label htmlFor="dataGroupName" className="peer-focus:font-medium absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 
            origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 
            peer-focus:-translate-y-6">Group Name</label>
          </div>
          <button type="submit" className="text-white bg-[#435334] hover:bg-[#F8EAD8] hover:text-black focus:ring-4 focus:outline-none 
          focus:ring-blue-300 font-medium rounded-lg text-sm sm:w-auto px-5 py-2.5 text-center">Submit</button>
        </form>

        <button type="button" className="flex justify-end ml-52 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 "
          onClick={() => allDatas()}>Show All</button>

        <div className="relative overflow-x-auto shadow-md sm:rounded-lg flex justify-center px-52">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr className='text-center'>
                <th className="px-6 py-3">
                  #
                </th>
                <th scope="col" className="px-6 py-3">
                  Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Capital
                </th>
                <th scope="col" className="px-6 py-3">
                  Currency
                </th>
                <th scope="col" className="px-6 py-3">
                  Language
                </th>
              </tr>
            </thead>
            <tbody>
              {isFiltered ? (
                filteredCountries.map((country: Country, index: number) => (
                  <tr
                    key={index}
                    className={`${index === bgColorIndex ? 'bg-[#9EB384]' : ''
                      } bg1-white border-b cursor-pointer text-center ${selected === index ? 'bg-[#F8EAD8]' : ""}`}
                    onClick={() => setSelected(index)}
                  >
                    <th>{index + 1}</th>
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                      {country.name} {country.emoji}
                    </th>
                    <td className="px-6 py-4 text-gray-900">{country.capital}</td>
                    <td className="px-6 py-4 text-gray-900">{country.currency}</td>
                    <td>
                      {country.languages.map((language) => (
                        <span key={language.code}>
                          {language.name} ({language.code})
                        </span>
                      ))}
                    </td>
                  </tr>
                ))
              ) : (
                data.countries.map((country: Country, index: number) => (
                  <tr
                    key={index}
                    className={`${index === bgColorIndex ? 'bg-[#9EB384]' : ''
                      } bg1-white border-b cursor-pointer text-center ${selected === index ? 'bg-[#F8EAD8]' : ""}`}
                    onClick={() => setSelected(index)}
                  >
                    <th>{index + 1}</th>
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                      {country.name} {country.emoji}
                    </th>
                    <td className="px-6 py-4">{country.capital}</td>
                    <td className="px-6 py-4">{country.currency}</td>
                    <td>
                      {country.languages.map((language) => (
                        <span key={language.code}>
                          {language.name} ({language.code})
                        </span>
                      ))}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return null;
}

export default App;
