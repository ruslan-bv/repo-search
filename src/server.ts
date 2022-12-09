import { RepositoryOptions } from './interfaces';

export const fetchRepoData = async (options: RepositoryOptions, page: number) => {
    const { name, language } = options;

    const url = `https://api.github.com/search/repositories`
    const response = await fetch(`${url}?q=${name}+language:${language}&sort=stars&per_page=20&page=${page}`);

    const result = response.json();
    return result;
}
