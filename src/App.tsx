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
  const [loader, setLoader] = useState<boolean>(false);

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

    setLoader(true);
    const { items } = await fetchRepoData(repo, 1);
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
    
    setPage(1);
    setRepos(preppedRepos);
    setLoader(false);
  }

  const handleNextPage = async (type: string) => {
    if (isThrottling) return;

    setIsThrottling(true);
    setLoader(true);
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
    setLoader(false);
  }

  useEffect(() => {
    // we throttle in 6 seconds since github api lets you do 10 requests per minute
    // so this way we do not go over their limit to access data
    if (isThrottling) {
      setTimeout(() => {
        setIsThrottling(false);
      }, 6000)
    }
  }, [isThrottling]);

  return (
    <div className="App">
      <h1>Github Repo Search</h1>
      <form onSubmit={handleSubmit}>
        <div className="form">
          <label>
            Name or Description:
            <input type="text" value={repo.name} onChange={handleChangeRepoName} />
          </label>
          <label>
            Language:
            <input type="text" value={repo.language} onChange={handleChangeRepoLanguage} />
          </label>
        </div>        
        <input className="submit" type="submit" />
      </form>
      {repos.length > 0 && !loader && 
      <>
        <Table repos={repos} />
        <div className="footer">
          <button disabled={page === 1} onClick={() => handleNextPage('back')}>Back</button>
          {page}
          <button onClick={() => handleNextPage('next')}>Next</button>
        </div>
      </>}
      {loader && <div className="loader"></div>}
    </div>
  );
}

export default App;
