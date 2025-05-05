// src/core/results/Result.ts

export class Result<T> {
    public readonly isSuccess: boolean;
    public readonly isFailure: boolean;
    public readonly error: string | null;
    private readonly _value?: T;

    private constructor(isSuccess: boolean, error?: string, value?: T) {
        if (isSuccess && error) {
            throw new Error("Successful result must not have an error");
        }

        if (!isSuccess && !error) {
            throw new Error("Failed result must contain an error");
        }

        this.isSuccess = isSuccess;
        this.isFailure = !isSuccess;
        this.error = error ?? null;
        this._value = value;
    }

    public get value(): T {
        if (!this.isSuccess) {
            throw new Error("Can't get value of failed result");
        }
        return this._value!;
    }

    public static ok<U>(value?: U): Result<U> {
        return new Result<U>(true, undefined, value);
    }

    public static fail<U>(error: string): Result<U> {
        return new Result<U>(false, error);
    }
}
