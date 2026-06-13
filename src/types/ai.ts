export interface AIModelParams {
  prompt?: string;
  image?: string;
  video?: string;
  [key: string]: unknown;
}

export interface AIModelOutput {
  text?: string;
  image?: string;
  video?: string;
  error?: string;
}

export interface AIModelAdapter {
  name: string;
  execute(params: AIModelParams): Promise<AIModelOutput>;
}
