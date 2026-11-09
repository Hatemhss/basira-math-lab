"""Educational character-level causal Transformer. Requires PyTorch.
Run: python tiny_llm.py --train train.txt --valid valid.txt --steps 200
Use independent UTF-8 files, each at least 66 characters. Not a production LLM.
"""
import argparse
import math
from pathlib import Path
import torch
from torch import nn
from torch.nn import functional as F

class TinyLM(nn.Module):
    def __init__(self, vocab, context=64, width=64):
        super().__init__()
        self.context = context
        self.token = nn.Embedding(vocab, width)
        self.position = nn.Embedding(context, width)
        # Independent layers; the causal mask makes this decoder-only behavior.
        self.layers = nn.ModuleList([
            nn.TransformerEncoderLayer(width, 4, 4*width, dropout=0.0,
                                       activation='gelu', batch_first=True,
                                       norm_first=True) for _ in range(2)])
        self.norm = nn.LayerNorm(width)
        self.head = nn.Linear(width, vocab)

    def forward(self, ids):
        length = ids.shape[1]
        x = self.token(ids) + self.position(torch.arange(length, device=ids.device))
        mask = torch.triu(torch.ones(length, length, device=ids.device,
                                     dtype=torch.bool), diagonal=1)
        for layer in self.layers:
            x = layer(x, src_mask=mask)
        return self.head(self.norm(x))

def batch(data, context=64, size=8):
    starts = torch.randint(len(data)-context, (size,))
    x = torch.stack([data[i:i+context] for i in starts])
    y = torch.stack([data[i+1:i+context+1] for i in starts])
    return x, y

@torch.no_grad()
def validation_loss(model, data):
    model.eval()
    total, tokens = 0.0, 0
    # Fixed, non-overlapping validation windows; no validation training.
    for start in range(0, len(data)-1, model.context):
        end = min(start+model.context, len(data)-1)
        x, y = data[start:end][None], data[start+1:end+1][None]
        loss = F.cross_entropy(model(x).flatten(0,1), y.flatten(), reduction='sum')
        total += loss.item()
        tokens += y.numel()
    return total/tokens

@torch.no_grad()
def generate(model, prompt, encode, chars, count=120):
    model.eval()
    ids = encode(prompt or chars[1])[None]
    for _ in range(count):
        logits = model(ids[:, -model.context:])[:, -1, :]
        nxt = torch.multinomial(F.softmax(logits, dim=-1), 1)
        ids = torch.cat((ids, nxt), dim=1)
    return ''.join(chars[i] if i else '�' for i in ids[0].tolist())

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--train', required=True)
    parser.add_argument('--valid', required=True)
    parser.add_argument('--steps', type=int, default=200)
    parser.add_argument('--prompt', default='')
    parser.add_argument('--output', default='tiny_llm.pt')
    args = parser.parse_args()
    if args.steps < 0:
        parser.error('steps must be nonnegative')
    torch.manual_seed(7)
    torch.set_num_threads(2)
    train_text = Path(args.train).read_text(encoding='utf-8')
    valid_text = Path(args.valid).read_text(encoding='utf-8')
    if min(len(train_text), len(valid_text)) < 66:
        parser.error('Both files must contain at least 66 characters')
    if train_text == valid_text:
        parser.error('Use independent training and validation documents')
    # Vocabulary is learned ONLY from training. ID 0 represents unknowns.
    chars = ['<UNK>'] + sorted(set(train_text))
    stoi = {c:i for i,c in enumerate(chars)}
    encode = lambda s: torch.tensor([stoi.get(c,0) for c in s], dtype=torch.long)
    train, valid = encode(train_text), encode(valid_text)
    model = TinyLM(len(chars))
    optimizer = torch.optim.AdamW(model.parameters(), lr=3e-4)
    print('parameters:', sum(p.numel() for p in model.parameters()))
    print('validation unknown fraction:', (valid == 0).float().mean().item())
    before = validation_loss(model, valid)
    for step in range(args.steps):
        model.train()
        x, y = batch(train)
        loss = F.cross_entropy(model(x).flatten(0,1), y.flatten())
        optimizer.zero_grad(set_to_none=True)
        loss.backward()
        nn.utils.clip_grad_norm_(model.parameters(), 1.0)
        optimizer.step()
        if (step+1) % 50 == 0:
            print('step', step+1, 'training loss', loss.item())
    after = validation_loss(model, valid)
    print('validation loss before / after:', before, after)
    print('validation perplexity:', math.exp(min(after, 50)))
    print(generate(model, args.prompt, encode, chars))
    # Save architecture and tokenizer alongside learned weights.
    torch.save({'state_dict': model.state_dict(), 'chars': chars,
                'context': 64, 'width': 64, 'layers': 2}, args.output)
    print('Saved:', args.output)

if __name__ == '__main__':
    main()
