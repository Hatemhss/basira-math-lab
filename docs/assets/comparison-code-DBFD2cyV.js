var e={ssd:`def experiment(h, draft, overhead):
    # Toy latency model; not a real SSD engine.
    before = 80 + draft
    after = 80 + (1-h)*draft + overhead
    return {"before": before, "after": after}`,evolve:`def experiment(budget):
    # Exhaustive toy scheduling, not an LLM coding agent.
    jobs = [9, 8, 7, 6, 5]
    best = sum(jobs)
    for mask in range(int(budget)):
        left = sum(t for i,t in enumerate(jobs) if mask & (1 << i))
        best = min(best, max(left, sum(jobs)-left))
    return {"before": sum(jobs), "after": best}`,grpo:`import math

def experiment(r1, r2, r3):
    # Illustrative preference update, NOT full clipped GRPO + KL.
    rewards = [r1, r2, r3]
    mean = sum(rewards)/3
    std = math.sqrt(sum((r-mean)**2 for r in rewards)/3)
    advantages = [(r-mean)/(std+1e-8) for r in rewards]
    weights = [math.exp(0.2*a) for a in advantages]
    probabilities = [w/sum(weights) for w in weights]
    after = sum(r*p for r,p in zip(rewards, probabilities))
    return {"before": mean, "after": after,
            "advantages": advantages, "probabilities": probabilities}`,moe:`import math

def experiment(k):
    # Active calls are a proxy, not measured speed or quality.
    scores = [8,7,6,5,4,3,2,1]
    outputs = [1,2,3,4,5,6,7,8]  # Toy expert outputs.
    def combine(ids):
        weights = [math.exp(scores[i]-8) for i in ids]
        return sum(w*outputs[i] for w,i in zip(weights,ids))/sum(weights)
    chosen = sorted(range(8), key=lambda i: -scores[i])[:int(k)]
    return {"before": 8, "after": int(k),
            "dense_output": combine(list(range(8))),
            "topk_output": combine(chosen)}`,flash:`import math

def experiment(n):
    # Score storage comparison, NOT total GPU memory or timing.
    scores, values = [1.0, 2.0, -1.0, 0.5], [2.0, 3.0, 1.0, 4.0]
    weights = [math.exp(s-max(scores)) for s in scores]
    dense = sum(w*v for w,v in zip(weights,values))/sum(weights)
    m, total, acc = -math.inf, 0.0, 0.0
    for start in range(0, len(scores), 2):
        block = scores[start:start+2]
        m2 = max(m, max(block))
        p = [math.exp(s-m2) for s in block]
        scale = math.exp(m-m2)
        acc = scale*acc + sum(w*v for w,v in zip(p,values[start:start+2]))
        total = scale*total + sum(p)
        m = m2
    online = acc/total
    assert abs(dense-online) < 1e-12
    return {"before": n*n, "after": 128*128,
            "dense_output": dense, "online_output": online}`,compute:`def experiment(p, n):
    # Probability of at least one success, not selected-answer accuracy.
    return {"before": 100*p, "after": 100*(1-(1-p)**n),
            "cost_before": 0.02, "cost_after": 0.02*n}`,"value-router":`def experiment(p, loss, expert):
    fast = 1 + (1-p)*loss
    deep = expert + 0.02*loss
    return {"before": deep, "after": min(fast,deep),
            "route": "fast" if fast <= deep else "deep"}`,"thinking-budget":`def experiment(budget):
    jobs = [(4,11),(3,8),(2,4),(5,12),(1,2)]
    used, baseline = 0, 0
    for cost,gain in jobs:
        if used+cost <= budget:
            used += cost
            baseline += gain
    best = 0
    for mask in range(1 << len(jobs)):
        selected = [job for i,job in enumerate(jobs) if mask & (1 << i)]
        if sum(c for c,g in selected) <= budget:
            best = max(best, sum(g for c,g in selected))
    return {"before": baseline, "after": best}`,"memory-gate":`import math

def experiment(age, tau, loss, refresh):
    p = 0.98*math.exp(-age/tau)
    reuse_cost = 0.2 + (1-p)*loss
    refresh_cost = refresh + 0.02*loss
    baseline = refresh_cost if age >= 7 else reuse_cost
    return {"before": baseline, "after": min(reuse_cost,refresh_cost),
            "assumed_correctness": p}`};export{e as t};