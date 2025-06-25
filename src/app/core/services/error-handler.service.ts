import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ErrorHandlerService {
    handleError(error: unknown, context?: string): string {
        console.error(`Error in ${context}:`, error);

        if (error instanceof HttpErrorResponse) {
            return this.handleHttpError(error);
        }

        if (error instanceof Error) {
            return error.message || 'An unexpected error occurred';
        }

        return 'An unexpected error occurred';
    }

    private handleHttpError(error: HttpErrorResponse): string {
        switch (error.status) {
            case 0:
                return 'Network error. Please check your connection.';
            case 404:
                return 'Resource not found';
            case 429:
                return 'Too many requests. Please try again later.';
            case 500:
                return 'Server error occurred';
            case 503:
                return 'Service temporarily unavailable';
            default:
                return `HTTP Error ${error.status}: ${error.message}`;
        }
    }

    logError(error: unknown, context?: string): void {
        console.error(`[${context || 'Unknown'}]`, error);
        // Here you could integrate with external logging services
    }
}
