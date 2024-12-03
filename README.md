# XDU-Test

前端部分


报错记录

⨯ ./src/layouts/BasicLayout/index.tsx
Error:
× Unexpected token `div`. Expected jsx identifier
╭─[/Users/hw/Desktop/XDU-Test-F/xdu-test-f/src/layouts/BasicLayout/index.tsx:52:1]
52 │   };
53 │
54 │   return (
55 │     <div
·      ───
56 │       id="basicLayout"
57 │       style={{
58 │         height: "100vh",
╰────

Caused by:
Syntax Error

Import trace for requested module:
./src/layouts/BasicLayout/index.tsx
./src/app/layout.tsx

# 解决
算了 毁灭吧 我烦了 直接用最新的next15了

明明一模一样 但是就是解析不了TSX
不知道为什么。。。

