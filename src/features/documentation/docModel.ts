export interface TrainingResult {
  batch_size: number;
  n_parameter_sets: number;
  decay_lr_plateau: number;
  decay_lr_ratio: string;
  optimiser: string;
  objective: number[][];
  train_objective: number[][];
  test_objective: number[][];
}
