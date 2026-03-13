export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Đường dẫn gốc tới kho GitHub tĩnh của bạn (nhánh main)
    const GITHUB_RAW_BASE = "https://raw.githubusercontent.com/thanhduongvs/kicad-http-library/main";

    // 1. XỬ LÝ ENDPOINT XÁC THỰC CỦA KICAD (Sửa lỗi 400 Bad Request)
    if (path === "/api/v1" || path === "/api/v1/") {
      return new Response(JSON.stringify({
        "categories": "",
        "parts": ""
      }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    // 2. XỬ LÝ CÁC ENDPOINT DỮ LIỆU CÒN LẠI
    if (path.startsWith("/api/v1/")) {
      const githubUrl = `${GITHUB_RAW_BASE}${path}`;
      
      try {
        const githubResponse = await fetch(githubUrl);

        if (!githubResponse.ok) {
          return new Response(`Not Found on GitHub`, { status: 404 });
        }

        const data = await githubResponse.text();

        return new Response(data, {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        });
      } catch (error) {
        return new Response("Internal Server Error", { status: 500 });
      }
    }

    return new Response("Not Found", { status: 404 });
  }
};