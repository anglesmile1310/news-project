## Hệ thống tin tức theo mô hình microservice

**1. Yêu cầu:**

Xây dựng một hệ thống tin tức nhỏ theo mô hình microservice.

![docker](./images/Architect.png)

***


| Người dùng          | Chức năng | Mô tả | Tình trạng                                                        |
| ------------------- | ------------ | -------- | ------------------------------------------------------------ |
| Guest, Admin                  | Đăng nhập       |Đăng nhập vào hệ thống, thực hiện các chức năng người dùng.   | Hoàn thành                                                      |
| Guest, Admin               | Đăng ký       | Đăng ký tài khoản để đăng nhập  | Hoàn thành |
| Guest, Admin | Xem bài Post        | Xem các tin tức, thể loại   | Hoàn thành                        |
| Admin, Guest        | Thêm Post         | Viết bài tin tức   | Hoàn thành                                               |
| Admin         | Sửa bài Post         | Chỉnh sửa lại bài viết đã đăng   | Hoàn thành                 |
| Admin         | xóa  Post         | xóa  bài viết đã đăng   | Hoàn thành        |
| Admin, Guest       | Thêm comment         | Viết bình luận tin tức   | Hoàn thành                                               |
| Admin, Guest         | Sửa comment         | Chỉnh sửa lại comment bài viết    | Hoàn thành                 |
| Admin, Guest         | Xóa comment         | Xóa comment đã viết   | Hoàn thành        |

Thiết kế database

**User**
***

|field| descripton|
|--|--|
|_id| Id User|
|username|tên đăng nhập|
|name|tên user|
|isAdmin|Có phải là admin không|
|password|Mật khẩu user|
|createTime| Thời gian tạo bản ghi|

Ví dụ (json):

	{ 
	    "_id" : ObjectId("5e3ce2545e79a600129fd308"), 
	    "username" : "tungcuong", 
	    "name" : "cuong", 
	    "isAdmin" : true, 
	    "password" : "12345678", 
	    "createTime" : "2020-02-07T03:06:49.133Z"
	}

**Category**
***

|field| description|
|--|--|
|_id| Id Category|
|displayName| Tên sẽ được hiển thị cho user|
|createBy| Người tạo, tham chiếu đến bảng user|
|createTime|Thời gian tạo|


Ví dụ (json):

	{ 
	    "_id" : ObjectId("5e3ce2939bf0d30012b81206"), 
	    "displayName" : "Giải trí", 
	    "createBy" : "5ddce267ea485f1ed7bc2f37", 
	    "createTime" : "2020-02-07T03:09:54.485Z"
	}

**Post**
***
|field| description|
|--|--|
|_id| Id Post|
|categories|Danh sách thể loại của bài post|
|title| Tiêu đề|
|content| Nội dung|
|owner| Người tạo, tham chiếu đến bảng user|
|description|Chú thích|
|createTime|Thời gian tạo|


Ví dụ (json):

	{ 
	    "_id" : ObjectId("5e3ce2939bf0d30012b81206"), 
	    "content" : "Tin Đàm Vĩnh Hưng", 
	    "categories" : [
		ObjectId("5e3ce2545e79a600129fd308")
	    ], 
	    "title":"Đàm Vĩnh Hưng gây sốt",
	    "owner" : ObjectId("5e3ce2545e79a600129fd308"), 
	    "description" : "", 
	    "createTime" : "2020-02-07T03:06:49.133Z"
	}
**Comment**
***
|field| description|
|--|--|
|_id| id Comment|
|content|Nội dung comment|
|fromPost| id bài Post|
|createTime|Thời gian tạo comment|


Ví dụ (json):

	{ 
	    "_id" : ObjectId("5e3ce2939bf0d30012b81206"), 
	    "content" : "Thông tin lá cải", 
	    "fromPost" : 		ObjectId("5e3ce2545e79a600129fd308"), 
	    "createTime" : "2020-02-07T03:06:49.133Z"
	}

## Build hệ thống với docker 

**Tất cả đều chạy file script start.sh nơi cấu hình để chạy docker đối với từng service**




**kết quả**

![docker](./images/resultRun.png)

**api-gateway**

![docker](./images/api_gateway.png  )



## Cấu trúc dữ liệu với api

**Header**

|name|description|
|--|--|
| token | Token trả về từ api login |

***

*Chú ý*

|	Các api update, delete,add cần có token 

**UserAPI**



1.Đăng ký:

|name|value|description|
|--|--|--|
|method| POST||
|host|localhost:3000|Base URL|
|route|/api/v1/user/register|địa chỉ route|
|Content-Type|*application/json* hoặc *x-www-form-urlencoded*| Header request|

*Body*

|name|description||type|
|--|--|--|--|
|name| Tên user|require|string|
|username|Tên đăng nhập|require|/^[a-zA-Z0-9'-]+$/i|
|password|Mật khẩu|require|string.min(8)|
|repeatPassword| Nhập lại mật khẩu|require|string|
|isAdmin| có phải admin không|require|string|

*Ví dụ*

	POST /api/v1/user/register HTTP/1.1
	Host: 192.168.1.13:3000
	Content-Type: application/json
	
	username=tungcuong&name=cuong&password=12345678&repeatPassword=12345678
	
2.Đăng nhập

|name|value|description|
|--|--|--|
|method| POST||
|host|192.168.1.13:3000|Base URL|
|route| /api/v1/user/login|địa chỉ route|
|Content-Type|*application/json* hoặc *x-www-form-urlencoded*| Header request|

*Body*

|name|description||type|
|--|--|--|--|
|username|Tên đăng nhập|require|string|
|password|Mật khẩu|require|string|

*Ví dụ*

	POST /api/v1/user/login HTTP/1.1
	Host: 192.168.1.13:3000
	Content-Type: application/json
	Cache-Control: no-cache

	username=tungcuong&password=12345678`

**CategoryAPI**

1.Thêm mới

|name|value|description|
|--|--|--|
|method| POST||
|host|192.168.1.13:3000|Base URL|
|route| /api/v1/category/add|địa chỉ route|
|Content-Type|*application/json* hoặc *x-www-form-urlencoded*| Header request|
|token|****|Token của user, thêm vào header|

*Body*

|name|description||type|
|--|--|--|--|
|displayName|Tên category|require|string|

*Ví dụ*


	POST /api/v1/category/add HTTP/1.1
	Host: 192.168.1.13:3000
	token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiY3VvbmciLCJ1c2VybmFtZSI6InR1bmdjdW9uZyIsImNyZWF0ZVRpbWUiOiIyMDIwLTAyLTA3VDAzOjA2OjQ5LjEzM1oiLCJfaWQiOiI1ZTNjZTI1NDVlNzlhNjAwMTI5ZmQzMDgiLCJpc0FkbWluIjp0cnVlLCJpYXQiOjE1ODEwNDg0MjYsImV4cCI6MTU4MTEzNDgyNn0.kgY0nN3gLA1Zr5hGLjeYfVfuue9PKvaZ5lK1nF3fzScAu5CwlTIqR2AQfLZLMcw_3Bp8Eyvz59pWpOOuqR54W8
	Content-Type: application/x-www-form-urlencoded
	Cache-Control: no-cache

	displayName=X%C3%A3+h%E1%BB%99i
	
	
2.Lấy category theo ID

|name|value|description|
|--|--|--|
|method| GET||
|host|192.168.1.13:3000|Base URL|
|route|/api/v1/category/:id|địa chỉ route|
|Content-Type|*application/json* hoặc *x-www-form-urlencoded*| Header request|

*Ví dụ*

``5e3ce2939bf0d30012b81206 là id catagory``


	GET /api/v1/category/5e3ce2939bf0d30012b81206 HTTP/1.1
	Host: 192.168.1.13:3000
	Content-Type: application/x-www-form-urlencoded
	Cache-Control: no-cache

	

	
3.Xoá category 

|name|value|description|
|--|--|--|
|method| DELETE||
|host|192.168.1.13:3000|Base URL|
|route|/api/v1/category/:id|địa chỉ route|
|Content-Type|*application/json* hoặc *x-www-form-urlencoded*| Header request|
|token|****|Token của user, thêm vào header|

*Ví dụ*

``5e3ce2939bf0d30012b81206 là id category``

	DELETE /api/v1/category/5e3ce2939bf0d30012b81206 HTTP/1.1
	Host: 192.168.1.13:3000
	token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiY3VvbmciLCJ1c2VybmFtZSI6InR1bmdjdW9uZyIsImNyZWF0ZVRpbWUiOiIyMDIwLTAyLTA3VDAzOjA2OjQ5LjEzM1oiLCJfaWQiOiI1ZTNjZTI1NDVlNzlhNjAwMTI5ZmQzMDgiLCJpc0FkbWluIjp0cnVlLCJpYXQiOjE1ODEwNDg0MjYsImV4cCI6MTU4MTEzNDgyNn0.kgY0nN3gLA1Zr5hGLjeYfVfuue9PKvaZ5lK1nF3fzSc
	Content-Type: application/x-www-form-urlencoded
	Cache-Control: no-cache
	
4.Update category

|name|value|description|
|--|--|--|
|method| PUT||
|host|192.168.1.13:3000|Base URL|
|route|/api/v1/category/:id|địa chỉ route|
|Content-Type|*application/json* hoặc *x-www-form-urlencoded*| Header request|
|token|****|Token của user, thêm vào header|

**Body**

|name|description||type|
|--|--|--|--|
|displayName|Tên hiển thị (Có thể multi language)|require|string|

*Ví dụ*
``5e3ce2939bf0d30012b81206 là id category``

	PUT /api/v1/category/5ddddab59843d511f40cad0d HTTP/1.1
		Host: localhost:3000
		token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiY3VvbmciLCJ1c2VybmFtZSI6InR1bmdjdW9uZyIsImNyZWF0ZVRpbWUiOiIyMDIwLTAyLTA3VDAzOjA2OjQ5LjEzM1oiLCJfaWQiOiI1ZTNjZTI1NDVlNzlhNjAwMTI5ZmQzMDgiLCJpc0FkbWluIjp0cnVlLCJpYXQiOjE1ODEwNDg0MjYsImV4cCI6MTU4MTEzNDgyNn0.kgY0nN3gLA1Zr5hGLjeYfVfuue9PKvaZ5lK1nF3fzSc
		Content-Type: application/x-www-form-urlencoded
		Cache-Control: no-cache

		displayName=Giải trí

**PostAPI**


	
1.Thêm mới

|name|value|description|
|--|--|--|
|method| POST||
|host|192.168.1.13:3000|Base URL|
|route| /api/v1/post/add|địa chỉ route|
|Content-Type|*application/json* hoặc *x-www-form-urlencoded*| Header request|
|token|****|Token của user, thêm vào header|

*Body*

|name|description||type|
|--|--|--|--|
|content|Nội dung bài viết|require|string|
|categories|Mảng các thể loại của bài viết|require|array|
|title|Tiêu đề của bài viết|require|string

*Ví dụ*



	POST /api/v1/post/add HTTP/1.1
	Host: localhost:3000
	token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiY3VvbmciLCJ1c2VybmFtZSI6InR1bmdjdW9uZyIsImNyZWF0ZVRpbWUiOiIyMDIwLTAyLTA3VDAzOjA2OjQ5LjEzM1oiLCJfaWQiOiI1ZTNjZTI1NDVlNzlhNjAwMTI5ZmQzMDgiLCJpc0FkbWluIjp0cnVlLCJpYXQiOjE1ODEwNDg0MjYsImV4cCI6MTU4MTEzNDgyNn0.kgY0nN3gLA1Zr5hGLjeYfVfuue9PKvaZ5lK1nF3fzSc
	Content-Type: application/x-www-form-urlencoded
	Cache-Control: no-cache

	name=xahoi&content=Tin giai tri&categories=5ddddab59843d511f40cad0d&title=tin dam vinh hung

2.Lấy Post theo id

|name|value|description|
|--|--|--|
|method| GET||
|host|192.168.1.13 :3000|Base URL|
|route|/api/v1/post/:id|địa chỉ route|
|Content-Type|*application/json* hoặc *x-www-form-urlencoded*| Header request|

*Ví dụ*

``6ddddbaa52b22212ed411899 là id post``

	GET /api/v1/post/6ddddbaa52b22212ed4c0899 HTTP/1.1
	Host: 192.168.1.13:3000
	Content-Type: application/x-www-form-urlencoded
	Cache-Control: no-cache

3.Lấy post theo IDUser

|name|value|description|
|--|--|--|
|method| GET||
|host|192.168.1.13 :3000|Base URL|
|route|/api/v1/post/getByUser/:id|địa chỉ route|
|Content-Type|*application/json* hoặc *x-www-form-urlencoded*| Header request|

*Ví dụ*

``8ddce267ea485f1ed7bc2f38 là id user``

	GET /api/v1/post/getByUser/8ddce267ea485f1ed7bc2f38 HTTP/1.1
	Host: 192.168.1.13:3000
	Content-Type: application/x-www-form-urlencoded
	Cache-Control: no-cache

4.Xoá post theo id

|name|value|description|
|--|--|--|
|method| DELETE||
|host|192.168.1.13:3000|Base URL|
|route|/api/v1/post/:id|địa chỉ route|
|Content-Type|*application/json* hoặc *x-www-form-urlencoded*| Header request|
|token|****|Token của user, thêm vào header|

*Ví dụ*

``9ddddbaa52b22212ed4c0899 là id post``

	DELETE /api/v1/post/5ddddbaa52b22212ed4c0896 HTTP/1.1
	Host: localhost:3000
	token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSG_DoG5nIFRy4bqnbiBI4bqjbyAiLCJ1c2VybmFtZSI6Imhhb2hhbzQiLCJjcmVhdGVUaW1lIjoiMjAxOS0xMS0yNlQwODoyOToyNC43MzhaIiwiX2lkIjoiNWRkY2UyNjdlYTQ4NWYxZWQ3YmMyZjM3IiwiaWF0IjoxNTc0ODE5MTA3LCJleHAiOjE1NzQ5MDU1MDd9.Au5CwlTIqR2AQfLZLMcw_3Bp8Eyvz59pWpOOuqR54W8
	Content-Type: application/x-www-form-urlencoded
	Cache-Control: no-cache

5.Lấy post  theo ID Category

|name|value|description|
|--|--|--|
|method| GET||
|host|127.0.0.1:3000|Base URL|
|route|/api/v1/post/getByCategory/:id|địa chỉ route|
|Content-Type|*application/json* hoặc *x-www-form-urlencoded*| Header request|

``5ddddab99843d511f40cad0e là id category``


	GET /api/v1/post/getByCategory/5ddddab99843d511f40cad0e HTTP/1.1
	Host: 192.168.1.13:3000
	Content-Type: application/x-www-form-urlencoded
	Cache-Control: no-cache
	
6.Update Post theo id

|name|value|description|
|--|--|--|
|method| PUT||
|host|192.168.1.13:3000|Base URL|
|route|/api/v1/post/:id|địa chỉ route|
|Content-Type|*application/json* hoặc *x-www-form-urlencoded*| Header request|
|token|****|Token của user, thêm vào header|

*Body*


|name|description||type|
|--|--|--|--|
|content|Nội dung bài viết|require|string|
|categories|Mảng các thể loại của bài viếtv
|title|Tiêu đề của bài viết|require|string|

*Ví dụ*

``9ddddab99843d511f40cad09 là id post``

	PUT /api/v1/post/9ddddab99843d511f40cad09 HTTP/1.1
	Host: 192.168.1.13:3000
	token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSG_DoG5nIFRy4bqnbiBI4bqjbyAiLCJ1c2VybmFtZSI6Imhhb2hhbzQiLCJjcmVhdGVUaW1lIjoiMjAxOS0xMS0yNlQwODoyOToyNC43MzhaIiwiX2lkIjoiNWRkY2UyNjdlYTQ4NWYxZWQ3YmMyZjM3IiwiaWF0IjoxNTc0ODE5MTA3LCJleHAiOjE1NzQ5MDU1MDd9.Au5CwlTIqR2AQfLZLMcw_3Bp8Eyvz59pWpOOuqR54W8
	Content-Type: application/x-www-form-urlencoded
	Cache-Control: no-cache

	content=Tin giai tri&categories=9ddddab59843d511f40cad09&title=tin dam vinh hung gay soc

**CommentAPI**

1.Thêm mới

|name|value|description|
|--|--|--|
|method| POST||
|host|192.168.1.13:3000|Base URL|
|route| /api/v1/comment/add|địa chỉ route|
|Content-Type|*application/json* hoặc *x-www-form-urlencoded*| Header request|
|token|****|Token của user, thêm vào header|

*Body*

|name|description||type|
|--|--|--|--|
|content|Nội dung comment|require|string|
|createBy|id của người dùng|require|string|
|fromPost|id của bài post|require|string

*Ví dụ*



	POST /api/v1/comment/add HTTP/1.1
	Host: 192.168.1.13:3000
	token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiY3VvbmciLCJ1c2VybmFtZSI6InR1bmdjdW9uZyIsImNyZWF0ZVRpbWUiOiIyMDIwLTAyLTA3VDAzOjA2OjQ5LjEzM1oiLCJfaWQiOiI1ZTNjZTI1NDVlNzlhNjAwMTI5ZmQzMDgiLCJpc0FkbWluIjp0cnVlLCJpYXQiOjE1ODEwNDg0MjYsImV4cCI6MTU4MTEzNDgyNn0.kgY0nN3gLA1Zr5hGLjeYfVfuue9PKvaZ5lK1nF3fzSc
	Content-Type: application/x-www-form-urlencoded
	Cache-Control: no-cache

	content=Tin giai tri&createBy=5ddddab59843d511f40cad0d&fromPost=9ddddab59843d511f40cad09

2.Lấy Comment theo id

|name|value|description|
|--|--|--|
|method| GET||
|host|192.168.1.13:3000|Base URL|
|route|/api/v1/comment/:id|địa chỉ route|
|Content-Type|*application/json* hoặc *x-www-form-urlencoded*| Header request|

*Ví dụ*

``6ddddbaa52b22212ed411899 là id comment``

	GET /api/v1/comment/6ddddbaa52b22212ed4c0899 HTTP/1.1
	Host: 192.168.1.13:3000
	Content-Type: application/x-www-form-urlencoded
	Cache-Control: no-cache

3.Lấy comment theo id của post

|name|value|description|
|--|--|--|
|method| GET||
|host|192.168.1.13:3000|Base URL|
|route|/api/v1/comment/getCommentByPost/:id|địa chỉ route|
|Content-Type|*application/json* hoặc *x-www-form-urlencoded*| Header request|

*Ví dụ*

``8ddce267ea485f1ed7bc2f38 là id post``

	GET /api/v1/comment/getCommentByPost/8ddce267ea485f1ed7bc2f38 HTTP/1.1
	Host: 192.168.1.13:3000
	Content-Type: application/x-www-form-urlencoded
	Cache-Control: no-cache

4.Xoá comment theo id

|name|value|description|
|--|--|--|
|method| DELETE||
|host|192.168.1.13:3000|Base URL|
|route|/api/v1/comment/:id|địa chỉ route|
|Content-Type|*application/json* hoặc *x-www-form-urlencoded*| Header request|
|token|****|Token của user, thêm vào header|

*Ví dụ*

``9ddddbaa52b22212ed4c0899 là id comment``

	DELETE /api/v1/comment/5ddddbaa52b22212ed4c0896 HTTP/1.1
	Host: 192.168.1.13:3000
	token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSG_DoG5nIFRy4bqnbiBI4bqjbyAiLCJ1c2VybmFtZSI6Imhhb2hhbzQiLCJjcmVhdGVUaW1lIjoiMjAxOS0xMS0yNlQwODoyOToyNC43MzhaIiwiX2lkIjoiNWRkY2UyNjdlYTQ4NWYxZWQ3YmMyZjM3IiwiaWF0IjoxNTc0ODE5MTA3LCJleHAiOjE1NzQ5MDU1MDd9.Au5CwlTIqR2AQfLZLMcw_3Bp8Eyvz59pWpOOuqR54W8
	Content-Type: application/x-www-form-urlencoded
	Cache-Control: no-cache
	
6.Update Comment theo id

|name|value|description|
|--|--|--|
|method| PUT||
|host|192.168.1.13:3000|Base URL|
|route|/api/v1/comment/:id|địa chỉ route|
|Content-Type|*application/json* hoặc *x-www-form-urlencoded*| Header request|
|token|****|Token của user, thêm vào header|

*Body*


|name|description||type|
|--|--|--|--|
|content|Nội dung comment|require|string|

*Ví dụ*

``9ddddab99843d511f40cad09 là id comment``

	PUT /api/v1/comment/9ddddab99843d511f40cad09 HTTP/1.1
	Host: 192.168.1.13:3000
	token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSG_DoG5nIFRy4bqnbiBI4bqjbyAiLCJ1c2VybmFtZSI6Imhhb2hhbzQiLCJjcmVhdGVUaW1lIjoiMjAxOS0xMS0yNlQwODoyOToyNC43MzhaIiwiX2lkIjoiNWRkY2UyNjdlYTQ4NWYxZWQ3YmMyZjM3IiwiaWF0IjoxNTc0ODE5MTA3LCJleHAiOjE1NzQ5MDU1MDd9.Au5CwlTIqR2AQfLZLMcw_3Bp8Eyvz59pWpOOuqR54W8
	Content-Type: application/x-www-form-urlencoded
	Cache-Control: no-cache

	content=Tin la cai

