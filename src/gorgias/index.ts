import axios from "axios";

class Gorgias {
  private readonly username: string;
  private readonly password: string;
  private readonly baseUrl: string = "http://aiasvm1.amcl.tuc.gr:8085";

  /**
   * @param username
   * @param password
   * @description Create a new Gorgias instance
   */
  constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
  }

  /**
   * @description Create a new project
   * @param projectName
   * @returns {Promise<string>} Ok message
   */
  async createProject(projectName: string): Promise<string> {
    const res = await axios.post(`${this.baseUrl}/createProject?project_name=${projectName}`, {
      auth: {
        username: this.username,
        password: this.password,
      },
    });

    if (res.status !== 200) throw new Error("Failed to create project");
    const result = (await res.data) as string;
    return result;
  }
  async addFile(url: string, projectName: string, type?: "gorgias" | "background") {
    const blob = await fetch(url).then((r) => r.blob());
  }
}
