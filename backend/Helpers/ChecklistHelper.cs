// src/Helpers/ChecklistHelper.cs
using System;
using System.Linq;
using System.Reflection;
using backend.Models.Operations;

namespace backend.Helpers
{
    public static class ChecklistHelper
    {
        private const string TechnicianNotesProperty = "TechnicianNotes";
        private const string CompletedAtProperty     = "CompletedAt";
        public static bool IsChecklistComplete(object? checklist)
        {
            if (checklist == null)
            {
                return true; // No checklist required → considered complete
            }

            var properties = checklist.GetType().GetProperties(BindingFlags.Public | BindingFlags.Instance)
                .Where(p =>
                    p.PropertyType == typeof(bool) &&
                    p.Name != TechnicianNotesProperty &&
                    p.Name != CompletedAtProperty
                );

            foreach (var prop in properties)
            {
                var value = (bool?)prop.GetValue(checklist);
                if (value != true)
                {
                    return false;
                }
            }

            return true;
        }

        /// <summary>
        /// Returns a friendly display name for the checklist type.
        /// Used for error messages.
        /// </summary>
        public static string GetChecklistDisplayName(object? checklist)
        {
            if (checklist == null) 
                return "Unknown Checklist";

            return checklist.GetType().Name switch
            {
                nameof(TyreChecklistRecord)     => "Tyre Technician Checklist",
                nameof(AlignmentChecklistRecord) => "Alignment Technician Checklist",
                nameof(BalancingChecklistRecord) => "Balancing Technician Checklist",
                nameof(PucChecklistRecord)       => "PUC Operator Checklist",
                nameof(CarWashChecklistRecord)   => "Car Wash Checklist",
                _                                => checklist.GetType().Name
            };
        }
    }
}