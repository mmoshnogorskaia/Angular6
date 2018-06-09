import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError, map, tap } from "rxjs/operators";

import { Repo } from "./repo";

@Injectable({
  providedIn: "root"
})
export class RepoService {
  constructor(private http: HttpClient) {}
  
  repos = [];
  savedRepos = [];

  getURLString(): any {}

  getRepos(url): Observable<Repo[]> {
    return this.http.get<any>(url).pipe(
      map(response => response.items),
      map(repos => {
        repos.archived = false;
        return repos;
      }),
      tap(repos => console.log("fetched repos")),
      catchError(this.handleError("getRepos", []))
    );
  }

  addRepo(repo: Repo): Repo[] {
    this.deleteRepo(repo).push(repo);
    console.log('repos after adding!', this.savedRepos);
    return this.savedRepos;
  }
  
  deleteRepo(repo: Repo): Repo[] {
    let oldRepos = [...this.savedRepos];
    this.savedRepos = oldRepos.filter(item => item.id !== repo.id);
    console.log('repos after deleting!', this.savedRepos);
    return this.savedRepos;
  }
 
  getFoundRepos() {
    let repos = [...this.repos];
    return repos;
  }

  getSavedRepos() {
    let savedRepos = [...this.savedRepos];
    return savedRepos;
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
