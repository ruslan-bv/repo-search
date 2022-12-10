import React, { useState, useEffect } from 'react';
import { Table } from './components/Table';
import { fetchRepoData } from './server';
import { RepositoryOptions, Repo } from './interfaces';
import './App.css';

export const App:React.FC = () => {
  const [repo, setRepo] = useState<RepositoryOptions>({name: '', language: ''});
  const [repos, setRepos] = useState<Repo[] | []>([]);
  const [page, setPage] = useState<number>(1);
  const [isThrottling, setIsThrottling] = useState<boolean>(false);

  const handleChangeRepoName = (e) => {
    setRepo((prevRepo) => {
      return {...prevRepo, name: e.target.value};
    })
  }

  const handleChangeRepoLanguage = (e) => {
    setRepo((prevRepo) => {
      return {...prevRepo, language: e.target.value};
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isThrottling) return;

    const { items } = await fetchRepoData(repo, page);
    setIsThrottling(true);
    const preppedRepos = items.map((repo) => {
      return {
        id: repo.id,
        name: repo.name,
        description: repo.description,
        login: repo.owner.login,
        url: repo.html_url
      }
    })
    setRepos(preppedRepos);
  }

  const handleNextPage = async (type: string) => {
    if (isThrottling) return;

    setIsThrottling(true);
    const newPage = type === 'next' ? page + 1 : page - 1;
    setPage(newPage);
    const { items } = await fetchRepoData(repo, newPage);
    const preppedRepos = items.map((repo) => {
      return {
        id: repo.id,
        name: repo.name,
        description: repo.description,
        login: repo.owner.login,
        url: repo.html_url
      }
    })
    setRepos(preppedRepos);
  }

  useEffect(() => {
    if (isThrottling) {
      setTimeout(() => {
        setIsThrottling(false);
      }, 5000)
    }
  }, [isThrottling]);

  return (
    <div className="App">
      <h1>Github Repo Search</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" value={repo.name} onChange={handleChangeRepoName} />
        </label>
        <label>
          Language:
          <input type="text" value={repo.language} onChange={handleChangeRepoLanguage} />
        </label>
        <input type="submit" />
      </form>
      {repos.length > 0 && 
      <>
        <Table repos={repos} />
        <div>
          {page > 1 && <button onClick={() => handleNextPage('back')}>Back</button>}
          {page}
          <button onClick={() => handleNextPage('next')}>Next</button>
        </div>
      </>}
    </div>
  );
}

export default App;
