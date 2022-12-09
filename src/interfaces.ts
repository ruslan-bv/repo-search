export interface RepositoryOptions {
    name: string;
    language: string;
}

export interface Repo {
    id: string;
    name: string;
    description: string;
    login: string;
    url: string;
}

export interface Repos {
    repos: Repo[]
}