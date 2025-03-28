import java.io.*;
import java.nio.file.*;
import java.util.*;

public class AIDirectoryManager {
    public static void main(String[] args) {
        String sourceDir = "C:/Users/YourUser/Documents/files";
        
        Map<String, String> fileCategory = new HashMap<>();
        fileCategory.put("txt", "Documents");
        fileCategory.put("pdf", "Documents");
        fileCategory.put("docx", "Documents");
        fileCategory.put("jpg", "Images");
        fileCategory.put("png", "Images");
        fileCategory.put("mp4", "Videos");

        File folder = new File(sourceDir);
        File[] files = folder.listFiles();

        if (files != null) {
            for (File file : files) {
                if (file.isFile()) {
                    classifyAndMoveFile(file, fileCategory, sourceDir);
                }
            }
        }
        System.out.println("File organization completed!");
    }

    private static void classifyAndMoveFile(File file, Map<String, String> fileCategory, String sourceDir) {
        String fileName = file.getName();
        String fileExtension = getFileExtension(fileName);

        String category = fileCategory.getOrDefault(fileExtension, "Others");

        if (fileExtension.equals("txt")) {
            category = classifyTextFile(file);
        }

        File targetDir = new File(sourceDir + "/" + category);
        if (!targetDir.exists()) {
            targetDir.mkdir();
        }

        Path sourcePath = file.toPath();
        Path targetPath = Paths.get(targetDir.getAbsolutePath(), fileName);
        
        try {
            Files.move(sourcePath, targetPath, StandardCopyOption.REPLACE_EXISTING);
            System.out.println("Moved: " + fileName + " → " + category);
        } catch (IOException e) {
            System.err.println("Error moving file " + fileName + ": " + e.getMessage());
        }
    }

    // Method to extract file extension
    private static String getFileExtension(String fileName) {
        int lastIndex = fileName.lastIndexOf('.');
        return (lastIndex == -1) ? "" : fileName.substring(lastIndex + 1);
    }

    
    private static String classifyTextFile(File file) {
        List<String> workKeywords = Arrays.asList("project", "report", "meeting", "deadline");
        List<String> personalKeywords = Arrays.asList("family", "vacation", "diary", "shopping");
        List<String> researchKeywords = Arrays.asList("AI", "machine learning", "research", "study");

        try (BufferedReader reader = new BufferedReader(new FileReader(file))) {
            String line;
            while ((line = reader.readLine()) != null) {
                line = line.toLowerCase();
                if (containsKeyword(line, workKeywords)) return "Work";
                if (containsKeyword(line, personalKeywords)) return "Personal";
                if (containsKeyword(line, researchKeywords)) return "Research";
            }
        } catch (IOException e) {
            System.err.println("Error reading file " + file.getName() + ": " + e.getMessage());
        }
        return "Others";
    }


    private static boolean containsKeyword(String line, List<String> keywords) {
        for (String keyword : keywords) {
            if (line.contains(keyword)) return true;
        }
        return false;
    }
}
