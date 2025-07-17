# # def compute_score(tries: int, difficulty: float, base_score: int = 100) -> float:
# #     if tries < 1:
# #         return 0  # Invalid
# #     max_penalty_tries = min(tries - 1, 10)
# #     efficiency_loss = max_penalty_tries * (5 * (1 / difficulty))
# #     difficulty_bonus = base_score * (difficulty - 1.0)
# #     raw_score = base_score - efficiency_loss + difficulty_bonus
# #     floor = base_score * 0.3 + difficulty_bonus
# #     return round(max(raw_score, floor), 2)



# def get_penalty_params(level: int):
#     if 1 <= level <= 10:
#         return 0.10, 0.10  # 10% per retry, floor 10%
#     elif 11 <= level <= 15:
#         return 0.06, 0.40  # 6% per retry, floor 40%
#     elif 16 <= level <= 20:
#         return 0.03, 0.70  # 3% per retry, floor 70%
#     else:
#         raise ValueError("Level out of range (1–20)")


# def compute_score(level: int, tries: int, base_score: int = 100) -> float:
#     if tries < 1:
#         return 0.0
#     penalty_rate, floor_pct = get_penalty_params(level)
#     raw_pct = 1.0 - penalty_rate * (tries - 1)
#     final_pct = max(raw_pct, floor_pct)
#     score = base_score * final_pct
#     return round(score, 2)



# def show_score_table():
#     # Example difficulties for levels 1–5
#     difficulties = {
#         1: 1.0,
#         2: 1.2,
#         3: 1.4,
#         4: 1.6,
#         5: 1.8
#     }

#     for level, difficulty in difficulties.items():
#         max_score = compute_score(1, difficulty)  # Best possible score for this level
#         print(f"\n=== Level {level} (Difficulty {difficulty}) ===")
#         print(f"{'Try':>4} | {'Score':>6} | {'% of Max':>9}")
#         print("-" * 28)
#         for tries in range(1, 21):
#             score = compute_score(tries, difficulty)
#             percent = (score / max_score) * 100
#             print(f"{tries:>4} | {score:>6} | {percent:>8.2f}%")


# # Run it
# show_score_table()
