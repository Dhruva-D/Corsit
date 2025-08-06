// Centralized designation configuration
// This ensures consistency across all components

export const DESIGNATION_ORDER = {
    'Member': 0,  // Added Member with lowest priority
    'First Year': 1,
    'Second Year': 2,
    'Third Year': 3,
    'Fourth Year': 4,
    'Photoshop Lead': 5,
    'Collaboration and Network Lead': 6,
    'Expedition Lead': 7,
    'App Dev Lead': 8,
    'Web Dev Lead': 9,
    'Video Lead': 10,
    'Tech Lead': 11,
    'Treasurer': 12,
    'Vice-Chairman': 13,
    'Chairman': 14
};

// Array version for dropdowns and listings (sorted by order)
export const DESIGNATION_OPTIONS = Object.keys(DESIGNATION_ORDER).sort(
    (a, b) => DESIGNATION_ORDER[a] - DESIGNATION_ORDER[b]
);

// Array version for sorting (highest to lowest priority)
export const DESIGNATION_SORT_ORDER = [
    "Chairman", "Vice-Chairman", "Treasurer", "Tech Lead", "Web Dev Lead", "App Dev Lead",
    "Expedition Lead", "Collaboration and Network Lead", "Photoshop Lead", "Video Lead",
    "Fourth Year", "Third Year", "Second Year", "First Year"
];

// Helper function to get designation priority for sorting
export const getDesignationPriority = (designation) => {
    return DESIGNATION_ORDER[designation] || 0; // Default to 0 (lowest priority) for unknown designations
};

// Helper function to sort users by designation
export const sortByDesignation = (users) => {
    return users.sort((a, b) => {
        // Get highest priority designation for sorting
        const getHighestPriorityDesignation = (user) => {
            if (!user.designations || user.designations.length === 0) {
                return 'Member'; // Default designation
            }
            
            // Find the designation with the highest priority number
            let highestPriority = 0;
            let highestDesignation = 'Member';
            
            user.designations.forEach(designation => {
                const priority = getDesignationPriority(designation);
                if (priority > highestPriority) {
                    highestPriority = priority;
                    highestDesignation = designation;
                }
            });
            
            return highestDesignation;
        };
        
        const aDesignation = getHighestPriorityDesignation(a);
        const bDesignation = getHighestPriorityDesignation(b);
        
        const aPriority = getDesignationPriority(aDesignation);
        const bPriority = getDesignationPriority(bDesignation);
        
        return bPriority - aPriority; // Higher priority first
    });
};
